import { expect } from 'chai';
import ExampleApp from '../page-objects/example-app';

describe('Example App', () => {
  const app = new ExampleApp();

  beforeEach((done) => {
    app.loadAt(browser.params.exampleAppDomain).then(done);
  });

  it('should have a Login button', () => {
    expect(app.hasLoginButton()).to.eventually.equal(true);
  });
});
