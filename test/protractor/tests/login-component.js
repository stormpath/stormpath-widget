import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';

describe('Login Component', () => {
  let loginComponent;
  let exampleApp;

  beforeEach(() => {
    exampleApp = new ExampleApp();
    exampleApp.loadAt(browser.params.exampleAppDomain).then(() => {
      return exampleApp.loginButton().click().then((resultOverlay) => {
        loginComponent = resultOverlay;
      });
    });
  });

  it('should be visible', () => {
    return expect(loginComponent.isVisible()).to.eventually.equal(true);

    // This sleep is not required, but for demo purposes this will give you
    // a chance to see the modal before the test exits.

    //browser.sleep(1000);
  });

  describe('username input', () => {
    let usernameInput;

    beforeEach(() => {
      usernameInput = loginComponent.usernameInput();
    });

    it('should be visible', () => {
      return expect(usernameInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('password input', () => {
    let passwordInput;

    beforeEach(() => {
      passwordInput = loginComponent.passwordInput();
    });

    it('should be visible', () => {
      return expect(passwordInput.isVisible()).to.eventually.equal(true);
    });
  });

  describe('login button', () => {
    let loginButton;

    beforeEach(() => {
      loginButton = loginComponent.loginButton();
    });

    it('should be visible', () => {
      return expect(loginButton.isVisible()).to.eventually.equal(true);
    });

    describe('when clicked', () => {

      /**
       * Safari does not support required attributes, and as such won't implment
       * this focusing behaviour.  If we want this, it will need to be implemented
       * manually
       *
       * http://stackoverflow.com/questions/23261301/required-attribute-not-work-in-safari-browser
       *
       * These focus tests are also failing in firefox, even though it visually appears to be
       * focusing the fields.  That will need more invesitation.  Again, we may need to implement
       * the focus behaviour manually if this is desired.
       *
       * Skipping these tests for now.
       */

      describe.skip('and username and password input is empty', () => {
        let usernameInput;

        beforeEach(() => {
          usernameInput = loginComponent.usernameInput();
          usernameInput.setValue('');
          loginButton.click();
        });

        it('should focus on username input', () => {
          return expect(usernameInput.isFocused()).to.eventually.equal(true);
        });
      });

      describe.skip('and only password input is empty', () => {
        let usernameInput;
        let passwordInput;

        beforeEach(() => {
          usernameInput = loginComponent.usernameInput();
          passwordInput = loginComponent.passwordInput();

          usernameInput.setValue('8a1de390-cb1f-4206-80f4-1d6b4b3d897c');

          loginButton.click();
        });

        it('should should focus on password input', () => {
          return expect(passwordInput.isFocused()).to.eventually.equal(true);
        });
      });

      describe('and username and password input is incorrect', () => {
        let errorMessage;
        let usernameInput;
        let passwordInput;

        beforeEach(() => {
          errorMessage = loginComponent.errorMessage();
          usernameInput = loginComponent.usernameInput();
          passwordInput = loginComponent.passwordInput();

          usernameInput.setValue('b4e10e27-279c-42cf-baa0-82b5dbf016e6');
          passwordInput.setValue('cc06bc07-a498-4aaa-b779-e05fa187ef56');

          loginButton.click();

          return errorMessage.waitUntilVisible();
        });

        it('should show invalid username/password error message', () => {
          return expect(errorMessage.getText()).to.eventually.equal('Invalid username or password.');
        });
      });

      describe('and username and password is valid', () => {
        let usernameInput;
        let passwordInput;

        beforeEach(() => {
          usernameInput = loginComponent.usernameInput();
          passwordInput = loginComponent.passwordInput();

          usernameInput.setValue(exampleApp.account.email);
          passwordInput.setValue(exampleApp.account.password);

          loginButton.click();

          return loginComponent.waitUntilRemoved();
        });

        it('should hide the login component', () => {
          return expect(loginComponent.isPresent()).to.eventually.equal(false);
        });
      });
    });
  });
});
