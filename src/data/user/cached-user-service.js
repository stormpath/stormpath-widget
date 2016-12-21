import utils from '../../utils';

class CachedUserService {
  constructor(userService, storage) {
    utils.createDecorator(this, userService);
    this.userService = userService;
    this.storage = storage;
  }

  _cachedPromise(key, cacheResolver) {
    const storageKey = 'cache.' + key;

    return this.storage.get(storageKey).then((result) => {
      if (result) {
        return Promise.resolve(JSON.parse(result));
      }

      return cacheResolver().then((result) => {
        this.storage.set(storageKey, JSON.stringify(result));
        return result;
      });
    });
  }

  getLoginViewModel() {
    return this._cachedPromise('login-view', () => this.userService.getLoginViewModel());
  }

  getRegistrationViewModel() {
    return this._cachedPromise('registration-view', () => this.userService.getRegistrationViewModel());
  }
}

export default CachedUserService;
