import EventEmitter from 'events';

class ClientApiUserService extends EventEmitter {
  constructor(httpProvider, tokenStorage) {
    super();
    httpProvider.setRequestInterceptor(this);
    this.httpProvider = httpProvider;
    this.tokenStorage = tokenStorage;
    this.account = null;
    this.mostRecentState = null;
  }

  _setState(newState, force, ...args) {
    if (this.mostRecentState !== newState || force) {
      this.mostRecentState = newState;
      this.emit(newState, ...args);
    }
  }

  _onLoginSuccessful(response) {
    return this.tokenStorage.setAccessToken(response.access_token).then(() => {
      let waitFor;

      if (response.refresh_token) {
        waitFor = this.tokenStorage.setRefreshToken(response.refresh_token);
      } else {
        waitFor = Promise.resolve();
      }

      waitFor.then(() => {
        return this.me().then((account) => {
          this._setState('loggedIn', true, account);
          this._setState('authenticated');
        });
      });
    });
  }

  getAccount() {
    return new Promise((accept) => {
      accept(this.account);
    });
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

    return this.tokenStorage.getAccessToken()
      .then((accessToken) => {
        if (!accessToken) {
          return unauthenticated();
        }

        if (this.account) {
          return authenticated();
        }

        return this.me()
          .then(authenticated)
          .catch(() =>
            this.tokenStorage.removeAll()
              .then(unauthenticated)
          );
      })
      .catch(unauthenticated);
  }

  onBeforeRequest(request) {
    return this.tokenStorage.getAccessToken()
      .then((accessToken) => {
        if (accessToken) {
          if (!request.headers) {
            request.headers = {};
          }
          request.headers['Authorization'] = 'Bearer ' + accessToken;
        }
      })
      .catch(() => Promise.resolve());
  }

  me() {
    return this.httpProvider.getJson('/me').then((result) => {
      const account = result.account;

      // Question is if we should do this...
      // I.e. cache the account to avoid hitting the /me endpoint unnecessarily when calling getState().
      this.account = account;

      return Promise.resolve(account);
    });
  }

  getLoginViewModel() {
    return this.httpProvider.getJson('/login');
  }

  getRegistrationViewModel() {
    return this.httpProvider.getJson('/register');
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
    }).then(this._onLoginSuccessful.bind(this));
  }

  tokenLogin(token) {
    if (token === undefined) {
      return new Promise((_, reject) => {
        reject(new Error('Token cannot be empty.'));
      });
    }

    return this.httpProvider.postForm('/oauth/token', {
      grant_type: 'stormpath_token',
      token
    }).then(this._onLoginSuccessful.bind(this));
  }

  verifyEmail(token) {
    return this.httpProvider.getJson('/verify', {
      sptoken: token
    });
  }

  register(data) {
    return this.httpProvider.postJson('/register', data).then((result) => {
      this.account = result.account;
      this._setState('registered');
      return Promise.resolve(result.account);
    });
  }

  sendForgotPasswordEmail(data) {
    return this.httpProvider.postJson('/forgot', data).then(() => {
      this._setState('forgotPasswordSent', true, data);
    });
  }

  changePassword(data) {
    return this.httpProvider.postJson('/change', data).then(() => {
      this._setState('passwordChanged', true);
    });
  }

  verifyPasswordResetToken(token) {
    return this.httpProvider.getJson('/change?sptoken=' + token);
  }

  logout() {
    return this.tokenStorage.getRefreshToken().then((refreshToken) => {
      return this.httpProvider.postForm('/oauth/revoke', {
        token: refreshToken,
        token_type_hint: 'refresh_token'
      }).then(() => {
        return this.tokenStorage.removeAll().then(() => {
          this.account = null;
          this._setState('loggedOut');
          this._setState('unauthenticated');
        });
      });
    });
  }
}

export default ClientApiUserService;
