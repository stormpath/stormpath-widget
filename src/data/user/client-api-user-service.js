import EventEmitter from 'events';

class ClientApiUserService extends EventEmitter {
  constructor(httpProvider, storage) {
    super();
    httpProvider.setRequestInterceptor(this);
    this.httpProvider = httpProvider;
    this.storage = storage;
    this.account = null;
    this.mostRecentState = null;
  }

  _setState(newState) {
    if (this.mostRecentState !== newState) {
      console.log('Setting state', newState);
      this.mostRecentState = newState;
      this.emit(newState);
    }
  }

  getAccount() {
    return new Promise((accept) => {
      accept(this.account);
    });
  }

  setToken(token) {
    return this.storage.set('stormpath.token', token);
  }

  getToken() {
    return this.storage.get('stormpath.token');
  }

  removeToken() {
    return this.storage.remove('stormpath.token');
  }

  getState() {
    const authenticated = () => {
      this._setState('authenticated');
      return Promise.resolve('authenticated');
    };

    const unauthenticated = () => {
      this._setState('unauthenticated');
      return Promise.resolve('unauthenticated');
    };

    return this.getToken()
      .then((token) => {
        if (!token) {
          return unauthenticated();
        }

        if (this.account) {
          return authenticated();
        }

        return this.me()
          .then(authenticated)
          .catch(this.removeToken().then(unauthenticated));
      })
      .catch(unauthenticated);
  }

  onBeforeRequest(request) {
    return this.getToken()
      .then((token) => {
        if (token) {
          if (!request.headers) {
            request.headers = {};
          }
          request.headers['Authorization'] = 'Bearer ' + token;
        }
      })
      .catch(() => Promise.resolve());
  }

  me() {
    return this.httpProvider.getJson('/me').then((result) => {
      // Question is if we should do this...
      // I.e. cache the account to avoid hitting the /me endpoint unnecessarily when calling getState().
      this.account = result.account;
    });
  }

  getLoginViewModel() {
    return this.httpProvider.getJson('/login');
  }

  login(username, password) {
    if (username === undefined || password === undefined) {
      return new Promise((_, reject) => {
        reject(new Error('Username or password cannot be empty.'));
      });
    }

    return this.httpProvider.postForm('/oauth/token', {
      grant_type: 'password',
      username,
      password
    }).then((response) => {
      return this.setToken(response.access_token);
    });
  }

  logout() {
    return this.storage.remove('stormpath.token').then(() => {
      this.account = null;
      this._setState('unauthenticated');
    });
  }
}

export default ClientApiUserService;
