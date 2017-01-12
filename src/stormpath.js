import extend from 'xtend';
import EventEmitter from 'events';

import ViewManager from './view-manager';
import utils from './utils';

import {
  AuthStrategy,
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
    container: null,
  };

  constructor(options) {
    super();

    // This needs to be fixed so that provided options override default.
    this.options = options = extend(this.options, options);

    this.storage = new LocalStorage();

    options.authStrategy = AuthStrategy.resolve(options.authStrategy, options.appUri);
    this.userService = this._createUserService(options.authStrategy, options.appUri);

    this._initializeUserServiceEvents();
    this._preloadViewModels();

    this.viewManager = new ViewManager(
      Stormpath.prefix,
      this.userService,
      options.templates,
      options.container
    );

    // Asynchronously handle any callback response.
    // This needs to happen after the ctor is done so any code after
    // new Stormpath() can set up event hooks watching for `loginError`
    setTimeout(this._handleCallbackResponse.bind(this));
  }

  _createUserService(authStrategy, appUri) {
    const httpProvider = new HttpProvider(appUri);

    let userService;

    switch (authStrategy) {
      case AuthStrategy.Token:
        this.tokenStorage = new TokenStorage(this.storage);
        userService = new ClientApiUserService(httpProvider, this.tokenStorage);
        break;

      case AuthStrategy.Cookie:
        userService = new CookieUserService(httpProvider);
        break;

      case AuthStrategy.Mock:
        userService = new MockUserService();
        break;
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

  showChangePassword(token) {
    const parsedQueryString = utils.parseQueryString(window.location.search);
    this.viewManager.showChangePassword(token || parsedQueryString.sptoken);
  }

  showForgotPassword() {
    return this.viewManager.showForgotPassword();
  }

  showLogin() {
    return this.viewManager.showLogin();
  }

  showRegistration() {
    return this.viewManager.showRegistration();
  }

  showEmailVerification(token) {
    const parsedQueryString = utils.parseQueryString(utils.getWindowQueryString());
    this.viewManager.showEmailVerification(token || parsedQueryString.sptoken);
  }

  logout() {
    return this.userService.logout();
  }
}

export default Stormpath;
