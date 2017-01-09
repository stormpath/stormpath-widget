class WindowProxy {
  static clearStorage() {
    return browser.executeScript(() => window.location).then((location) => {
      // If no page is loaded in the scenario then clearing storage will cause an exception.
      // So avoid this by checking if a hostname is present.
      if (!location.hostname) {
        return Promise.resolve();
      }

      return browser.executeScript(() => {
        window.sessionStorage.clear();
        window.localStorage.clear();
      });
    });
  }
}

export default WindowProxy;
