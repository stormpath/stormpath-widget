class LoginComponentObject {
  constructor() {
  }

  isVisible() {
    return element(by.css('.sp-login-component')).isDisplayed();
  }

  passwordField() {
    return element(by.id('sp-form-login-password'));
  }

  togglePasswordButton() {
    return element(by.css('.sp-password-toggle'));
  }

  clickTogglePasswordButton() {
    this.togglePasswordButton().click();
  }
}

export default LoginComponentObject;
