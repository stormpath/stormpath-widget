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

    return this.httpProvider.postForm('/oauth/token', requestData)
      .then((result) => {
        return Promise.all([
          this.setAccessToken(result.access_token),
          this.setRefreshToken(result.refresh_token)
        ]);
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
            }).catch((err) => {
              if (err.status >= 400 && err.status < 500) {
                return this.removeAll().then(() => {
                  return Promise.reject(err);
                });
              }
              return Promise.reject(err);
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
    return Promise.all([
      this.storage.remove('stormpath.access_token'),
      this.storage.remove('stormpath.refresh_token')
    ]);
  }
}

export default TokenStorage;
