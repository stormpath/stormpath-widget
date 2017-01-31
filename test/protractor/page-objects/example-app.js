import ButtonObject from './button';
import LoginComponentObject from './login-component';
import RegistrationComponentObject from './registration-component';
import ForgotPasswordComponentObject from './forgot-password-component';
import stormpath from 'stormpath';
import uuid from 'uuid';
import WindowProxy from '../proxies/window';

class ExampleApp {

  static account;

  constructor() {
    this.createTestAccount();
  }

  createTestAccount() {
    const spClient = new stormpath.Client();
    spClient.getApplication(process.env.STORMPATH_APPLICATION_HREF, (err, application) => {

      const newAccount = {
        givenName: uuid.v4(),
        surname: uuid.v4(),
        email: 'robert+' + uuid.v4() + '@stormpath.com',
        password: uuid.v4() + uuid.v4().toUpperCase() + '!'
      };

      application.createAccount(newAccount, (err, account) => {
        if (err) {
          throw err;
        }
        this.account = account;
        this.account.password = newAccount.password;
      });

    });
  }

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
