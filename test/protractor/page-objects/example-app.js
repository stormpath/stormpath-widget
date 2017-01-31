import ButtonObject from './button';
import LoginComponentObject from './login-component';
import RegistrationComponentObject from './registration-component';
import ForgotPasswordComponentObject from './forgot-password-component';
import WindowProxy from '../proxies/window';

class ExampleApp {
  loadAt(url) {
    // Clear storage to ensure we have a clean slate.
    return WindowProxy.clearStorage().then(() => {
      return browser.get(url);
    });
  }

  getLoginWidgetContainer() {
    return Promise.resolve(by.css('.sp-modal'));
  }

  loginButton() {
    return new ButtonObject(
      by.id('login-button'),
      this.getLoginWidgetContainer().then((selector) => {
        return new LoginComponentObject(selector);
      })
    );
  }

  registerButton() {
    return new ButtonObject(
      by.id('register-button'),
      this.getLoginWidgetContainer().then((selector) => {
        return new RegistrationComponentObject(selector);
      })
    );
  }

  forgotPasswordButton() {
    return new ButtonObject(
      by.id('forgot-password-button'),
      this.getLoginWidgetContainer().then((selector) => {
        return new ForgotPasswordComponentObject(selector);
      })
    );
  }

  logoutButton() {
    return new ButtonObject(by.id('logout-button'));
  }
}

export default ExampleApp;
