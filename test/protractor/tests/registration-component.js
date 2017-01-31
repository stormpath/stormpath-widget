import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';

describe('Registration Component', () => {
  let registrationComponent;

  beforeEach(() => {
    const app = new ExampleApp();
    app.loadAt(browser.params.exampleAppDomain).then(() => {
      return app.registerButton().click().then((resultOverlay) => {
        registrationComponent = resultOverlay;
      });
    });
  });

  it('should be visible', () => {
    return expect(registrationComponent.isVisible()).to.eventually.equal(true);

    // This sleep is not required, but for demo purposes this will give you
    // a chance to see the modal before the test exits.

    //browser.sleep(1000);
  });

  describe('first name input', () => {
    let firstNameInput;

    beforeEach(() => {
      firstNameInput = registrationComponent.firstNameInput();
    });

    it('should be visible', () => {
      return expect(firstNameInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('last name input', () => {
    let lastNameInput;

    beforeEach(() => {
      lastNameInput = registrationComponent.lastNameInput();
    });

    it('should be visible', () => {
      return expect(lastNameInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('email input', () => {
    let emailInput;

    beforeEach(() => {
      emailInput = registrationComponent.emailInput();
    });

    it('should be visible', () => {
      return expect(emailInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('password input', () => {
    let passwordInput;

    beforeEach(() => {
      passwordInput = registrationComponent.passwordInput();
    });

    it('should be visible', () => {
      return expect(passwordInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('register button', () => {
    let registerButton;

    beforeEach(() => {
      registerButton = registrationComponent.registerButton();
    });

    it('should be visible', () => {
      return expect(registerButton.isVisible()).to.eventually.equal(true);
    });
  });
});
