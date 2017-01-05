import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';
import LoginComponentObject from '../page-objects/login-component';

describe('Login Component', () => {
  const app = new ExampleApp();
  const loginComponent = new LoginComponentObject();

  beforeEach((done) => {
    app.loadAt(browser.params.exampleAppDomain).then(done);
  });

  it('should appear when invoked by showLogin()', () => {
    app.clickLoginButton();
    expect(loginComponent.isVisible()).to.eventually.equal(true);

    // This sleep is not required, but for demo purposes this will give you
    // a chance to see the modal before the test exits.

    browser.sleep(1000);
  });
});
