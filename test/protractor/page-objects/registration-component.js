import InputObject from './input';
import ButtonObject from './button';
import OverlayObject from './overlay';

class RegistrationComponentObject extends OverlayObject {
  firstNameInput() {
    return new InputObject(by.id('registration-field-givenName'));
  }

  lastNameInput() {
    return new InputObject(by.id('registration-field-surname'));
  }

  emailInput() {
    return new InputObject(by.id('registration-field-email'));
  }

  passwordInput() {
    return new InputObject(by.id('registration-field-password'));
  }

  registerButton() {
    return new ButtonObject(by.css('form button[rv-on-click=onFormSubmit]'));
  }
}

export default RegistrationComponentObject;
