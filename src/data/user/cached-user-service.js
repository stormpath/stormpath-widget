import utils from '../../utils';

class CachedUserService {
  constructor(userService, storage) {
    utils.decoratePublicMethods(this, userService);
    this.userService = userService;
    this.storage = storage;
    this.resolvePromises = {};
  }

  _cachedPromise(key, cacheResolver) {
    const storageKey = 'cache.' + key;

    return this.storage.get(storageKey).then((result) => {
      if (result) {
        return Promise.resolve(JSON.parse(result));
      }

      if (key in this.resolvePromises) {
        return this.resolvePromises[key];
      }

      const resolvePromise = cacheResolver().then((result) => {
        this.storage.set(storageKey, JSON.stringify(result)).then(() => {
          delete this.resolvePromises[key];
        });
        return result;
      });

      this.resolvePromises[key] = resolvePromise;

      return resolvePromise;
    });
  }

  getForgotEndpointResponse() {
    return this._cachedPromise('forgot-endpoint-response', () => this.userService.getForgotEndpointResponse());
  }

  getLoginViewModel() {
    return this._cachedPromise('login-view', () => this.userService.getLoginViewModel());
  }

  getRegistrationViewModel() {
    return this._cachedPromise('registration-view', () => this.userService.getRegistrationViewModel());
  }
}

export default CachedUserService;
