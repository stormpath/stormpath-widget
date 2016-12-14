import Rivets from 'rivets';

import LoginComponent from './login';

class Stormpath {
  static version = pkg.version;

  constructor(options) {
    this.options = options;

  }

  showLogin() {
    console.log('Showing login!');
    return new LoginComponent();
  }


}

export default Stormpath;
