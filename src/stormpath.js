import Rivets from 'rivets';
import { LoginComponent } from './components';

class Stormpath {
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
    // This needs to be fixed so that provided options override default.
    options = this.options;
    this._initializeRivets(options.templates);
  }

  _initializeRivets(templates) {
    Rivets.configure({
      prefix: Stormpath.prefix
    });

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
    const data = {};
    Rivets.init(Stormpath.prefix + '-' + LoginComponent.id, targetElement, data);
  }
}

export default Stormpath;
