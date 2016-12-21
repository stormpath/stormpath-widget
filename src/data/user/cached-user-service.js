function getAllPropertyNames(obj) {
  let names = [];

  do {
    names.push.apply(names, Object.getOwnPropertyNames(obj));
    obj = Object.getPrototypeOf(obj);
  } while(obj !== Object.prototype);

  return names.filter(name => name !== 'constructor');
}

function createDecorator(decorator, decorated) {
  getAllPropertyNames(decorated.constructor.prototype).forEach((name) => {
    const member = decorated[name];

    // Skip constructors and private members.
    if (name === 'constructor' || name[0] === '_') {
      return;
    }

    // Skip members overridden in decorator.
    if (name in decorator) {
      return;
    }

    // Skip any members that aren't functions.
    if (typeof member !== 'function') {
      return;
    }

    decorator[name] = member.bind(decorated);
  });
}

class CachedUserService {
  constructor(userService, storage) {
    createDecorator(this, userService);
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
