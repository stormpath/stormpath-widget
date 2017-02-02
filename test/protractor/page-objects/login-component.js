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
    return element(by.className('sp-password-toggle')).isDisplayed();
  }

  clickTogglePasswordButton() {
    return this.togglePasswordButton().click();
  }

  isPasswordFieldPlaintext() {
    return this.passwordField().getAttribute('type') === 'text';
  }
}

export default LoginComponentObject;
