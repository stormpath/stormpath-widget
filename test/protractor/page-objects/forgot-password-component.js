import InputObject from './input';
import ButtonObject from './button';
import OverlayObject from './overlay';

class ForgotPasswordComponentObject extends OverlayObject {
  emailInput() {
    return new InputObject(by.id('forgot-password-field-login'));
  }

  sendPasswordLinkButton() {
    return new ButtonObject(by.css('form button[rv-on-click=onFormSubmit]'));
  }
}

export default ForgotPasswordComponentObject;
