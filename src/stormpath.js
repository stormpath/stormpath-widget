import extend from 'xtend';
import Rivets from 'rivets';
import EventEmitter from 'events';

import { LoginComponent } from './components';
import { HttpProvider, LocalStorage, MockUserService, ClientApiUserService, CookieUserService } from './data';

class Stormpath extends EventEmitter {
  static prefix = 'sp';
  static version = pkg.version;

  options = {
    templates: {
      [LoginComponent.id]: {
        component: LoginComponent,
        view: () => LoginComponent.view
      }
    }
  };

  constructor(options) {
    super();

    // This needs to be fixed so that provided options override default.
    options = extend(this.options, options);

    this.userService = this._createUserService(options);

    this._initializeUserServiceEvents();
    this._initializeRivets(options.templates);
  }

  _createUserService(options) {
    const httpProvider = new HttpProvider(options.api);

    let userService;

    switch (options.authStrategy) {
      case 'token':
        userService = new ClientApiUserService(httpProvider, new LocalStorage());
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

  showLogin(element) {
    const targetElement = element || document.body;
    const data = {
      userService: this.userService
    };
    Rivets.init(Stormpath.prefix + '-' + LoginComponent.id, targetElement, data);
  }
}

export default Stormpath;
