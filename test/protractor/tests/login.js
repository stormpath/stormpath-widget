import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';
import LoginComponentObject from '../page-objects/login-component';


describe('Login Component', () => {
  const app = new ExampleApp();
  const loginComponent = new LoginComponentObject();

  beforeEach((done) => {
    app.loadAt(browser.params.exampleAppUri).then(done);
  });

  it('should appear when invoked by showLogin()', () => {
    app.clickLoginButton();
    expect(loginComponent.isVisible()).to.eventually.equal(true);

    // This sleep is not required, but for demo purposes this will give you
    // a chance to see the modal before the test exits.

    browser.sleep(1000);
  });

  it('should toggle password visibility when the Show button is clicked', () => {
    app.clickLoginButton();
    expect(loginComponent.isVisible()).to.eventually.equal(true);
    
    loginComponent.clickTogglePasswordButton();
    expect(loginComponent.passwordField().getAttribute('type')).to.eventually.equal('text');
    
    loginComponent.clickTogglePasswordButton();
    expect(loginComponent.passwordField().getAttribute('type')).to.eventually.equal('password');
  });

  it('should show the Forgot Password Component when clicking Forgot Password', () => {
    throw new Error('TODO!');
  });

  it('should show the Register Component when clicking Sign Up', () => {
    throw new Error('TODO!');
  });

  describe('Social login section', () => {
    it('should not appear when no social accountStores are mapped', () => {
      throw new Error('TODO!');
    });

    it('should appear when social accountStores are mapped to the application', () => {
      throw new Error('TODO!');
    });

    it('should show single accountStore as a full-width button', () => {
      throw new Error('TODO!');
    });

    it('should show multiple accountStores as a row of buttons', () => {
      throw new Error('TODO!');
    });

    it('should display a More button if >4 accountStores are mapped', () => {
      throw new Error('TODO!');
    });
  });

  describe('Password login section', () => {
    it('should not submit when the login field is empty', () => {
      throw new Error('TODO!');
    });

    it('should not submit when the password field is empty', () => {
      throw new Error('TODO!');
    });

    it('should show the spinner when login is processing', () => {
      // Possibly put this test in a better place
      throw new Error('TODO!');
    });

    it('should hide the spinner when login is done processing', () => {
      // Possibly put this test in a better place
      throw new Error('TODO!');
    });

    it('should show the server error when the login attempt is invalid', () => {
      throw new Error('TODO!');
    });

    it('should emit the authenticated event when the login attempt is valid', () => {
      throw new Error('TODO!');
    });
  });
});
