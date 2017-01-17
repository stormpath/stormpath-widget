import DomObject from './dom';
import InputObject from './input';
import ButtonObject from './button';
import OverlayObject from './overlay';

class LoginComponentObject extends OverlayObject {
  usernameInput() {
    return new InputObject(by.css('form input[name=login]'));
  }

  passwordInput() {
    return new InputObject(by.css('form input[name=password]'));
  }

  loginButton() {
    return new ButtonObject(by.css('form button[type=submit]'));
  }

  errorMessage() {
    return new DomObject(by.css('.sp-error-text'));
  }
}

export default LoginComponentObject;
