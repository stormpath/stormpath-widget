import Rivets from 'rivets';

class Stormpath {
  static version = pkg.version;

  constructor(options) {
    this.options = options;
  }

  showLogin() {
    console.log('Showing login!');
    console.log('Rivets:', Rivets);
  }
}

export default Stormpath;
