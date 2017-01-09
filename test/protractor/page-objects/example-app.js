import ButtonObject from './button';
import LoginComponentObject from './login-component';
import RegistrationComponentObject from './registration-component';
import ForgotPasswordComponentObject from './forgot-password-component';
import WindowProxy from '../proxies/window';

class ExampleApp {
  loadAt(url) {
    // Clear storage to ensure we have a clean slate.
    return WindowProxy.clearStorage().then(() => {
      browser.get(url);
    });
  }

  loginButton() {
    return new ButtonObject(
      by.id('login-button'),
      () => new LoginComponentObject(by.css('.sp-modal'))
    );
  }

  registerButton() {
    return new ButtonObject(
      by.id('register-button'),
      () => new RegistrationComponentObject(by.css('.sp-modal'))
    );
  }

  forgotPasswordButton() {
    return new ButtonObject(
      by.id('forgot-password-button'),
      () => new ForgotPasswordComponentObject(by.css('.sp-modal'))
    );
  }

  logoutButton() {
    return new ButtonObject(by.id('logout-button'));
  }
}

export default ExampleApp;
