class WindowProxy {
  static clearStorage() {
    return browser.executeScript(() => window.location).then((location) => {
      // If no page is loaded in the scenario then calling clearStorage will cause exception
      // so guard against this by checking hostname (If no page loaded then hostname == '').
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
