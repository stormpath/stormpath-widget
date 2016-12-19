import EventEmitter from 'events';

class TokenStorage extends EventEmitter {
  constructor(storage) {
    super();
    this.storage = storage;
  }

  getAccessToken() {
    return this.storage.get('stormpath.access_token');
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
