import { expect } from 'chai';
import StormpathInstanceProxy from '../proxies/stormpath-instance';
import ExampleApp from '../page-objects/example-app';

describe('Login Component', () => {
  let loginComponent;

  beforeEach(() => {
    const app = new ExampleApp();
    app.loadAt(browser.params.exampleAppUri).then(() => {
      return app.loginButton().click().then((resultOverlay) => {
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
      describe('and username and password input is empty', () => {
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

      describe('and only password input is empty', () => {
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
        let loggedInEventAsyncId;
        let usernameInput;
        let passwordInput;

        beforeEach(() => {
          StormpathInstanceProxy.once('loggedIn').then((asyncId) => {
            loggedInEventAsyncId = asyncId;
          });

          usernameInput = loginComponent.usernameInput();
          passwordInput = loginComponent.passwordInput();

          usernameInput.setValue('robin+test@stormpath.com');
          passwordInput.setValue('Test12345_');

          loginButton.click();

          return loginComponent.waitUntilRemoved();
        });

        it('should hide login component', () => {
          return expect(loginComponent.isPresent()).to.eventually.equal(false);
        });

        it('should trigger loggedIn event', () => {
          return expect(StormpathInstanceProxy.pollAsyncResult(loggedInEventAsyncId)).to.eventually.be.ok;
        });

        describe('stormpath.getAccessToken()', () => {
          it('should return an access token', () => {
            return expect(StormpathInstanceProxy.getAccessToken()).to.eventually.be.ok;
          });
        });
      });
    });
  });
});
