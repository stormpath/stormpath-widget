import extend from 'xtend';
import EventEmitter from 'events';

import ViewManager from './view-manager';
import utils from './utils';

import {
  CachedUserService,
  ClientApiUserService,
  CookieUserService,
  HttpProvider,
  LocalStorage,
  MemoryStorage,
  MockUserService,
  TokenStorage,
} from './data';

class Stormpath extends EventEmitter {
  static prefix = 'sp';
  static version = pkg.version;

  storage = null;
  tokenStorage = null;

  options = {
    appUri: null,
    authStrategy: null,
  };

  constructor(options) {
    super();

    // This needs to be fixed so that provided options override default.
    this.options = options = extend(this.options, options);

    if (!options.authStrategy) {
      // If we haven't set an auth strategy and point our appUri to a Stormpath app endpoint,
      // then automatically use the token auth strategy.
      if (options.appUri && options.appUri.indexOf('.stormpath.io') > -1) {
        options.authStrategy = 'token';
      // Else, default to using cookie.
      } else {
        options.authStrategy = 'cookie';
      }
    }

    this.storage = new LocalStorage();

    this.userService = this._createUserService(options);
    this._initializeUserServiceEvents();
    this._preloadViewModels();

    this.viewManager = new ViewManager(
      Stormpath.prefix,
      options.templates,
      this.userService
    );

    // Asynchronously handle any callback response.
    // This needs to happen after the ctor is done so any code after
    // new Stormpath() can set up event hooks watching for `loginError`
    setTimeout(this._handleCallbackResponse.bind(this));
  }

  _createUserService(options) {
    const httpProvider = new HttpProvider(options.appUri);

    let userService;

    switch (options.authStrategy) {
      case 'token':
        this.tokenStorage = new TokenStorage(this.storage, httpProvider);
        userService = new ClientApiUserService(httpProvider, this.tokenStorage);
        break;

      case 'mock':
        userService = new MockUserService();
        break;

      case 'cookie':
        userService = new CookieUserService(httpProvider);
        break;

      default:
        throw new Error('Invalid authStrategy \'' + options.authStrategy + '\'.');
    }

    // Decorate our user service with caching
    userService = new CachedUserService(userService, new MemoryStorage());

    return userService;
  }

  _initializeUserServiceEvents() {
    this.userService.on('loggedIn', () => this.emit('loggedIn'));
    this.userService.on('loggedOut', () => this.emit('loggedOut'));
    this.userService.on('registered', () => this.emit('registered'));
    this.userService.on('authenticated', () => this.emit('authenticated'));
    this.userService.on('unauthenticated', () => this.emit('unauthenticated'));
    this.userService.on('forgotPasswordSent', () => this.emit('forgotPasswordSent'));
    this.userService.on('passwordChanged', () => this.emit('passwordChanged'));

    // Make an initial request to getState() in order to trigger our first user events.
    this.userService.getState();
  }

  _preloadViewModels() {
    this.userService.getLoginViewModel();
    this.userService.getRegistrationViewModel();
  }

  _handleCallbackResponse() {
    const parsedQueryString = utils.parseQueryString(utils.getWindowQueryString());

    if (parsedQueryString.error || parsedQueryString.error_description) {
      // TODO: Render human-readable errors in UI somewhere...
      // The full list of error codes is here: https://tools.ietf.org/html/rfc6749#section-4.1.2.1
      this.emit('loginError', parsedQueryString.error);
    }

    const assertionToken = parsedQueryString.jwtResponse;

    if (!assertionToken) {
      return;
    }

    if (window.history.replaceState) {
      const cleanedLocation = window.location.toString()
        .replace('jwtResponse=' + assertionToken, '');

      window.history.replaceState(null, null, cleanedLocation);
    }

    this.userService.tokenLogin(assertionToken)
      .catch((e) => this.emit('loginError', e.message));
  }

  getAccount() {
    return this.userService.getAccount();
  }

  getAccessToken() {
    if (!this.tokenStorage) {
      return Promise.resolve(null);
    }

    return this.tokenStorage.getAccessToken();
  }

  showChangePassword(renderTo, token) {
    const parsedQueryString = utils.parseQueryString(window.location.search);
    this.viewManager.showChangePassword(renderTo, token || parsedQueryString.sptoken);
  }

  showForgotPassword(renderTo) {
    return this.viewManager.showForgotPassword(renderTo);
  }

  showLogin(renderTo) {
    return this.viewManager.showLogin(renderTo);
  }

  showRegistration(renderTo) {
    return this.viewManager.showRegistration(renderTo);
  }

  showEmailVerification(renderTo, token) {
    const parsedQueryString = utils.parseQueryString(utils.getWindowQueryString());
    this.viewManager.showEmailVerification(renderTo, token || parsedQueryString.sptoken);
  }

  logout() {
    return this.userService.logout();
  }
}

export default Stormpath;
