import EventEmitter from 'events';

import utils from '../../utils';

class ClientApiUserService extends EventEmitter {
  constructor(httpProvider, tokenStorage) {
    super();
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

  _getAuthorizationHeader() {
    return this.tokenStorage.getAccessToken().then((accessToken) => {
      return 'Bearer ' + accessToken;
    });
  }

  _onLoginSuccessful(response) {
    return Promise.all([
      this.tokenStorage.setAccessToken(response.access_token),
      this.tokenStorage.setRefreshToken(response.refresh_token)
    ]).then(() => {
      return this.me().then((account) => {
        this._setState('loggedIn', true, account);
        this._setState('authenticated');
      });
    });
  }

  /**
   * Given a remote view model, do the following:
   * - Remove out account stores that don't have an authorizeUri
   * - Set the `redirect_uri` param of the authorizeUri to be the current host
   */
  _vieModelTransform(data) {
    const accountStores = data.accountStores.filter((store) => store.authorizeUri);

    accountStores.forEach((accountStore) => {
      accountStore.authorizeUri += '&redirect_uri=' + utils.getCurrentHost();
    });

    data.accountStores = accountStores;
    return Promise.resolve(data);
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

  me() {
    return this._getAuthorizationHeader().then((authorizationHeader) => {
      const options = {
        headers: {
          Authorization: authorizationHeader
        }
      };

      return this.httpProvider.getJson('/me', null, options).then((result) => {
        const account = result.account;

        // Question is if we should do this...
        // I.e. cache the account to avoid hitting the /me endpoint unnecessarily when calling getState().
        this.account = account;

        return Promise.resolve(account);
      });
    });
  }

  getForgotEndpointResponse() {
    return this.httpProvider.getJson('/forgot');
  }

  getLoginViewModel() {
    return this.httpProvider.getJson('/login').then(this._vieModelTransform);
  }

  getRegistrationViewModel() {
    return this.httpProvider.getJson('/register').then(this._vieModelTransform);
  }

  login(username, password) {
    if (username === undefined || password === undefined) {
      return Promise.reject(new Error('Username or password cannot be empty.'));
    }

    const request = {
      grant_type: 'password',
      username,
      password
    };

    return this.httpProvider.postForm('/oauth/token', request)
      .then(this._onLoginSuccessful.bind(this));
  }

  tokenLogin(token) {
    if (token === undefined) {
      return Promise.reject(new Error('Token cannot be empty.'));
    }

    const request = {
      grant_type: 'stormpath_token',
      token
    };

    return this.httpProvider.postForm('/oauth/token', request)
      .then(this._onLoginSuccessful.bind(this));
  }

  verifyEmail(token) {
    return this.httpProvider.getJson('/verify', {
      sptoken: token
    });
  }

  register(data) {
    return this.httpProvider.postJson('/register', data).then((result) => {
      const account = this.account = result.account;

      switch (account.status.toLowerCase()) {
        case 'enabled':
          this._setState('registered');
          break;

        case 'unverified':
          this._setState('emailVerificationRequired');
          break;

        default:
          return Promise.reject(new Error('Account returned unknown status \'' + account.status + '\'.'));
      }

      return Promise.resolve(account);
    });
  }

  sendForgotPasswordEmail(data) {
    return this.httpProvider.postJson('/forgot', data).then(() => {
      this._setState('forgotPasswordSent', true, data);
    });
  }

  sendVerificationEmail(data) {
    return this.httpProvider.postJson('/verify', data).then(() => {
      this._setState('verifyEmailSent', true, data);
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
