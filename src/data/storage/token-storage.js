import EventEmitter from 'events';
import utils from '../../utils';

class TokenStorage extends EventEmitter {
  constructor(storage, httpProvider) {
    super();
    this.storage = storage;
    this.httpProvider = httpProvider;
    this.refreshTokenTimeoutId = null;
    this.getRefreshToken().then(this._manageRefreshTokenExpiration.bind(this));
  }

  _manageRefreshTokenExpiration(refreshToken) {
    return new Promise((accept, reject) => {
      if (this.refreshTokenTimeoutId) {
        clearTimeout(this.refreshTokenTimeoutId);
        this.refreshTokenTimeoutId = null;
      }

      if (!refreshToken) {
        return accept();
      }

      const parsedJwt = utils.parseJwt(refreshToken);

      if (!parsedJwt || parsedJwt.body.exp === undefined) {
        return reject(new Error('Invalid refresh token.'));
      }

      const runSecondsInAdvance = 60;
      const currentTimestamp = utils.getUnixTime();
      const runInSeconds = Math.max(parsedJwt.body.exp - currentTimestamp - runSecondsInAdvance, 1);

      this.refreshTokenTimeoutId = setTimeout(
        this._requestTokenRefresh.bind(this, refreshToken),
        runInSeconds * 1000 // in milliseconds
      );

      accept();
    });
  }

  _requestTokenRefresh(refreshToken) {
    const requestData = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };

    this.httpProvider.postForm('/oauth/token', requestData)
      .then((result) => {
        return this.setAccessToken(result.access_token)
          .then(this.setRefreshToken(result.refresh_token));
      });
  }

  getAccessToken() {
    return this.storage.get('stormpath.access_token');
  }

  setAccessToken(value) {
    return this.storage.set('stormpath.access_token', value).then(() => {
      this.emit('set', 'access_token', value);
    });;
  }

  removeAccessToken() {
    return this.storage.remove('stormpath.access_token').then(() => {
      this.emit('removed', 'access_token');
    });
  }

  getRefreshToken() {
    return this.storage.get('stormpath.refresh_token');
  }

  setRefreshToken(value) {
    return this.storage.set('stormpath.refresh_token', value)
      .then(this._manageRefreshTokenExpiration.bind(this, value))
      .then(() => {
        this.emit('set', 'refresh_token', value);
      });;
  }

  removeRefreshToken() {
    return this.storage.remove('stormpath.refresh_token').then(() => {
      this.emit('removed', 'refresh_token');
    });
  }

  removeAll() {
    return this.removeAccessToken().then(this.removeRefreshToken());
  }
}

export default TokenStorage;
