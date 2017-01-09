import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';

describe('Example App', () => {
  let app;

  beforeEach((done) => {
    app = new ExampleApp();
    app.loadAt(browser.params.exampleAppUri).then(done);
  });

  it('should have a login button', () => {
    expect(app.loginButton().isVisible()).to.eventually.equal(true);
  });

  it('should have a registration button', () => {
    expect(app.registerButton().isVisible()).to.eventually.equal(true);
  });

  it('should have a forgot password button', () => {
    expect(app.forgotPasswordButton().isVisible()).to.eventually.equal(true);
  });
});
