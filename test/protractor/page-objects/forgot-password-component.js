import InputObject from './input';
import ButtonObject from './button';
import LoadableObject from './loadable';

class ForgotPasswordComponentObject extends LoadableObject {
  emailInput() {
    return new InputObject(by.css('form input[name=email]'));
  }

  sendPasswordLinkButton() {
    return new ButtonObject(by.css('form button[type=submit]'));
  }
}

export default ForgotPasswordComponentObject;
