import InputObject from './input';
import ButtonObject from './button';
import OverlayObject from './overlay';

class ForgotPasswordComponentObject extends OverlayObject {
  emailInput() {
    return new InputObject(by.css('form input[name=email]'));
  }

  sendPasswordLinkButton() {
    return new ButtonObject(by.css('form button[type=submit]'));
  }
}

export default ForgotPasswordComponentObject;
