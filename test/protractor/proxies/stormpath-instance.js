class StormpathInstanceProxy {
  static getAccessToken() {
    return browser.executeAsyncScript((callback) => {
      window.Stormpath.getInstance().getAccessToken().then(callback);
    });
  }

  // Return an async id because if we were to return a promise or do anything else in our
  // callback that would e.g. wait for the event, the whole selenium pipeline would hang up
  // and it would just end up timing out. So this is a hack to work around that issue.
  static once(eventName) {
    return browser.executeAsyncScript((eventName, callback) => {
      if (!window._protractorAsyncCallbacks) {
        window._protractorAsyncId = 0;
        window._protractorAsyncCallbacks = {};
      }

      const asyncId = ++window._protractorAsyncId;

      window.Stormpath.getInstance().once(eventName, () => {
        // Currently just set the result as true, because if we set it to
        // arguments, then it unfortunately fails when retrieving the result.
        // I think this is because the arguments object returned is too complex
        // and when selenium tries to serialize/deserialize that object, it fails.
        window._protractorAsyncCallbacks[asyncId] = true;
      });

      callback(asyncId);
    }, eventName);
  }

  // This is a hack because selenium blocks directly it detects anything
  // it needs to "wait on". I.e. if we return a promise that isn't directly
  // resolved it seems that it waits for that indefinitely.
  static getAsyncResult(asyncId, timeout = 10 * 1000) {
    return new Promise((accept, reject) => {
      let retryTimeoutId;

      const expireTimeoutId = setTimeout(() => {
        clearTimeout(retryTimeoutId);
        reject(new Error('Timeout out while waiting for async result.'));
      }, timeout);

      const checkResult = () => {
        return browser.executeAsyncScript((asyncId, callback) => {
          if (!(asyncId in window._protractorAsyncCallbacks)) {
            return callback(false);
          }

          const result = window._protractorAsyncCallbacks[asyncId];
          delete window._protractorAsyncCallbacks[asyncId];

          callback(result);
        }, asyncId).then((result) => {
          if (result === false) {
            retryTimeoutId = setTimeout(checkResult, 500);
            return;
          }

          clearTimeout(expireTimeoutId);

          accept(result);
        });
      };

      retryTimeoutId = setTimeout(checkResult, 500);
    });
  }
}

export default StormpathInstanceProxy;
