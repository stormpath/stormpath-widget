import EventEmitter from 'events';
import utils from '../../utils';

class TokenStorage extends EventEmitter {
  constructor(storage, httpProvider) {
    super();
    this.storage = storage;
    this.httpProvider = httpProvider;
    this.refreshTokenPromiseCache = null;
  }

  _requestTokenRefresh(refreshToken) {
    const requestData = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };

    const options = {
      // This is necessary because without it the onBeforeRequest-handler will try and retrieve the access token
      // from the token store, but because the refreshTokenPromiseCache is set, it will end up waiting indefinitely.
      // Setting this flag just means that we skip that step and call the API without setting an Authorization header.
      skipAuthorizationHeader: true
    };

    return this.httpProvider.postForm('/oauth/token', requestData, options)
      .then((result) => {
        return this.setAccessToken(result.access_token)
          .then(this.setRefreshToken(result.refresh_token));
      });
  }

  getAccessToken() {
    if (this.refreshTokenPromiseCache) {
      return this.refreshTokenPromiseCache;
    }

    const readFromStorage = () => this.storage.get('stormpath.access_token');

    return readFromStorage().then((accessToken) => {
      if (!accessToken) {
        return;
      }

      const parsedToken = utils.parseJwt(accessToken);
      const expireAt = parsedToken.body.exp;

      if (expireAt > 0 && utils.getUnixTime() > expireAt) {
        return this.refreshTokenPromiseCache = this.getRefreshToken().then((refreshToken) => {
          if (!refreshToken) {
            this.refreshTokenPromiseCache = null;
            return accessToken;
          }

          return this._requestTokenRefresh(refreshToken)
            .then(() => {
              this.refreshTokenPromiseCache = null;
              return readFromStorage();
            });
        });
      }

      return accessToken;
    });
  }

  setAccessToken(value) {
    return this.storage.set('stormpath.access_token', value);
  }

  getRefreshToken() {
    return this.storage.get('stormpath.refresh_token');
  }

  setRefreshToken(value) {
    return this.storage.set('stormpath.refresh_token', value);
  }

  removeAll() {
    return this.storage.remove('stormpath.access_token').then(() => {
      return this.storage.remove('stormpath.refresh_token');
    });
  }
}

export default TokenStorage;
