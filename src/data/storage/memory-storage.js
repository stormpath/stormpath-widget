class MemoryStorage {
  constructor() {
    this.registry = {};
  }

  get(key) {
    return Promise.resolve(this.registry[key]);
  }

  set(key, value) {
    this.registry[key] = value;
    return Promise.resolve();
  }

  remove(key) {
    delete this.registry[key];
    return Promise.resolve();
  }
}

export default MemoryStorage;
