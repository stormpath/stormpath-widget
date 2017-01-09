import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';

describe('Forgot Password Component', () => {
  let forgotPasswordComponent;

  beforeEach(() => {
    const app = new ExampleApp();
    app.loadAt(browser.params.exampleAppUri).then(() => {
      return app.forgotPasswordButton().click().then((overlayResult) => {
        forgotPasswordComponent = overlayResult;
      });
    });
  });

  it('should be visible', () => {
    return expect(forgotPasswordComponent.isVisible()).to.eventually.equal(true);

    // This sleep is not required, but for demo purposes this will give you
    // a chance to see the modal before the test exits.

    //browser.sleep(1000);
  });

  describe('email input', () => {
    let emailInput;

    beforeEach(() => {
      emailInput = forgotPasswordComponent.emailInput();
    });

    it('should be visible', () => {
      return expect(emailInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('send password link button', () => {
    let sendPasswordLinkButton;

    beforeEach(() => {
      sendPasswordLinkButton = forgotPasswordComponent.sendPasswordLinkButton();
    });

    it('should be visible', () => {
      return expect(sendPasswordLinkButton.isVisible()).to.eventually.equal(true);
    });
  });
});
