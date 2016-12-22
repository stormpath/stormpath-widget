import extend from 'xtend';
import Rivets from 'rivets';
import EventEmitter from 'events';

import utils from './utils';

import {
  ModalComponent,
  FormFieldComponent,
  LoginComponent,
  RegistrationComponent,
  ChangePasswordComponent,
  ForgotPasswordComponent
} from './components';

import {
  ClientApiUserService,
  CookieUserService,
  HttpProvider,
  LocalStorage,
  MockUserService,
  TokenStorage,
} from './data';

class Stormpath extends EventEmitter {
  static prefix = 'sp';
  static version = pkg.version;

  storage = null;
  tokenStorage = null;

  options = {
    authStrategy: null,

    templates: {
      [ChangePasswordComponent.id]: {
        component: ChangePasswordComponent,
        view: () => ChangePasswordComponent.view
      },
      [FormFieldComponent.id]: {
        component: FormFieldComponent,
        view: () => FormFieldComponent.view
      },
      [ForgotPasswordComponent.id]: {
        component: ForgotPasswordComponent,
        view: () => ForgotPasswordComponent.view
      },
      [LoginComponent.id]: {
        component: LoginComponent,
        view: () => LoginComponent.view
      },
      [RegistrationComponent.id]: {
        component: RegistrationComponent,
        view: () => RegistrationComponent.view
      }
    }
  };

  constructor(options) {
    super();

    // This needs to be fixed so that provided options override default.
    this.options = options = extend(this.options, options);

    // If we haven't set an auth strategy and point our appUri to a Stormpath app endpoint,
    // then automatically use the token auth strategy.
    if (!options.authStrategy && options.appUri.indexOf('.apps.stormpath.io') > -1) {
      options.authStrategy = 'token';
    }

    this.modal = new ModalComponent();
    this.storage = new LocalStorage();
    this.userService = this._createUserService(options);

    this._initializeUserServiceEvents();
    this._initializeRivets(options.templates);
  }

  _createUserService(options) {
    const httpProvider = new HttpProvider(options.appUri);

    let userService;

    switch (options.authStrategy) {
      case 'token':
        this.tokenStorage = new TokenStorage(this.storage);
        userService = new ClientApiUserService(httpProvider, this.tokenStorage);
        break;

      case 'mock':
        userService = new MockUserService();
        break;

      default:
        userService = new CookieUserService(httpProvider);
        break;
    }

    return userService;
  }

  _initializeUserServiceEvents() {
    this.userService.on('loggedIn', () => this.emit('loggedIn'));
    this.userService.on('loggedOut', () => this.emit('loggedOut'));
    this.userService.on('registered', () => this.emit('registered'));
    this.userService.on('authenticated', () => this.emit('authenticated'));
    this.userService.on('unauthenticated', () => this.emit('unauthenticated'));

    // Make an initial request to getState() in order to trigger our first user events.
    this.userService.getState();
  }

  _initializeRivets(templates) {
    Rivets.configure({
      prefix: Stormpath.prefix
    });

    Rivets.formatters['is'] = (a, b) => a === b;
    Rivets.formatters['isnt'] = (a, b) => a !== b;
    Rivets.formatters['in'] = (a, b) => (b || '').split(',').indexOf(a) !== -1;

    Rivets.binders.required = (el, val) => el.required = val === true;
    Rivets.formatters.prefix = (name, prefix) => prefix + name;

    for (var id in templates) {
      const options = templates[id];
      Rivets.components[Stormpath.prefix + '-' + id] = {
        template: options.view,
        initialize: (el, data) => new options.component(data)
      };
    }
  }

  getAccount() {
    return this.userService.getAccount();
  }

  getAccessToken() {
    if (!this.tokenStorage) {
      throw new Error('No token store is present. Please verify that you\'ve set the \'authStrategy\' option to \'token\'.');
    }

    return this.tokenStorage.getAccessToken();
  }

  showChangePassword(renderTo, sptoken) {
    const modalMode = renderTo === undefined;
    const parsedQueryString = utils.parseQueryString(window.location.search);

    const data = {
      userService: this.userService,
      modal: modalMode ? this.modal : null,
      sptoken: sptoken || parsedQueryString.sptoken
    };

    Rivets.init(
      Stormpath.prefix + '-' + ChangePasswordComponent.id,
      modalMode ? this.modal.element : renderTo,
      data
    );

    if (modalMode) {
      this.modal.show();
    }
  }

  showForgotPassword(renderTo) {
    const modalMode = renderTo === undefined;

    const data = {
      userService: this.userService,
      modal: modalMode ? this.modal : null
    };

    Rivets.init(
      Stormpath.prefix + '-' + ForgotPasswordComponent.id,
      modalMode ? this.modal.element : renderTo,
      data
    );

    if (modalMode) {
      this.modal.show();
    }
  }

  showLogin(renderTo) {
    const modalMode = renderTo === undefined;

    const data = {
      userService: this.userService,
      modal: modalMode ? this.modal : null
    };

    Rivets.init(
      Stormpath.prefix + '-' + LoginComponent.id,
      modalMode ? this.modal.element : renderTo,
      data
    );

    if (modalMode) {
      this.modal.show();
    }
  }

  showRegistration(renderTo) {
    const modalMode = renderTo === undefined;

    const data = {
      userService: this.userService,
      modal: modalMode ? this.modal : null
    };

    Rivets.init(
      Stormpath.prefix + '-' + RegistrationComponent.id,
      modalMode ? this.modal.element : renderTo,
      data
    );

    if (modalMode) {
      this.modal.show();
    }
  }

  logout() {
    return this.userService.logout();
  }
}

export default Stormpath;
