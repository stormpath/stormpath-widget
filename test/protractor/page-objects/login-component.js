import DomObject from './dom';
import InputObject from './input';
import ButtonObject from './button';
import OverlayObject from './overlay';

class LoginComponentObject extends OverlayObject {
  usernameInput() {
    return new InputObject(by.id('sp-form-login-login'));
  }

  passwordInput() {
    return new InputObject(by.id('sp-form-login-password'));
  }

  loginButton() {
    return new ButtonObject(by.css('form button[type=submit]'));
  }

  errorMessage() {
    return new DomObject(by.css('.sp-error'));
  }
}

export default LoginComponentObject;
