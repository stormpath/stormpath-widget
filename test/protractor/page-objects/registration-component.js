import InputObject from './input';
import ButtonObject from './button';
import LoadableObject from './loadable';

class RegistrationComponentObject extends LoadableObject {
  firstNameInput() {
    return new InputObject(by.css('form input[name=givenName]'));
  }

  lastNameInput() {
    return new InputObject(by.css('form input[name=surname'));
  }

  emailInput() {
    return new InputObject(by.css('form input[name=email]'));
  }

  passwordInput() {
    return new InputObject(by.css('form input[name=password]'));
  }

  registerButton() {
    return new ButtonObject(by.css('form button[type=submit]'));
  }
}

export default RegistrationComponentObject;
