import ButtonObject from './button';
import SelectObject from './select';
import LoginComponentObject from './login-component';
import RegistrationComponentObject from './registration-component';
import ForgotPasswordComponentObject from './forgot-password-component';
import WindowProxy from '../proxies/window';

class ExampleApp {
  loadAt(url) {
    // Clear storage to ensure we have a clean slate.
    return WindowProxy.clearStorage().then(() => {
      browser.get(url);
      return this.renderToSelect().select('Overlay');
    });
  }

  renderToSelect() {
    return new SelectObject(by.id('render-to'));
  }

  _getRenderToTarget() {
    return this.renderToSelect().getValue().then((renderTo) => {
      switch (renderTo) {
        case 'container':
          return Promise.resolve(by.css('.sp-container'));

        case 'overlay':
          return Promise.resolve(by.css('.sp-modal'));

        default:
          return Promise.reject(new Error('Invalid render to target ' + renderTo + '.'));
      }
    });
  }

  loginButton() {
    return new ButtonObject(
      by.id('login-button'),
      this._getRenderToTarget().then((selector) => {
        return new LoginComponentObject(selector);
      })
    );
  }

  registerButton() {
    return new ButtonObject(
      by.id('register-button'),
      this._getRenderToTarget().then((selector) => {
        return new RegistrationComponentObject(selector);
      })
    );
  }

  forgotPasswordButton() {
    return new ButtonObject(
      by.id('forgot-password-button'),
      this._getRenderToTarget().then((selector) => {
        return new ForgotPasswordComponentObject(selector);
      })
    );
  }

  logoutButton() {
    return new ButtonObject(by.id('logout-button'));
  }
}

export default ExampleApp;
