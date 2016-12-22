import EventEmitter from 'events';

class CookieUserService extends EventEmitter {
  constructor(httpProvider) {
    super();
    this.httpProvider = httpProvider;
  }

  getState() {
    return Promise.resolve('unauthenticated');
  }

  getLoginViewModel() {
    return this.httpProvider.getJson('/login');
  }

  login(username, password) {
    return this.httpProvider.postJson('/login', {
      username,
      password
    });
  }
}

export default CookieUserService;
