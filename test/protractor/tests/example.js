import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ExampleApp from '../page-objects/example-app';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Example App', () => {
  const app = new ExampleApp();

  beforeEach((done) => {
    app.loadAt(browser.params.exampleAppUri).then(done);
  });

  it('should have a Login button', () => {
    expect(app.hasLoginButton()).to.eventually.equal(true);
  });
});
