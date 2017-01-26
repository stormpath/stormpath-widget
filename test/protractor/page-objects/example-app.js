class ExampleApp {
  clickLoginButton() {
    this.loginButton().click();
  }

  loadAt(url) {
    browser.get(url);

    // Allow the view models to settle
    return browser.sleep(1000);
  }

  loginButton() {
    return element(by.id('login-button')).isDisplayed();
  }

  hasLoginButton() {
    return element(by.id('login-button')).isDisplayed();
  }
}

export default ExampleApp;
