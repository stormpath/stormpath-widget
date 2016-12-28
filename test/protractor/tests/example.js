const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

const ExampleApp = require('../page-objects/example-app');

chai.use(chaiAsPromised);

describe('Example App', function () {
  const app = new ExampleApp();

  beforeEach(function (done) {
    app.loadAt(browser.params.exampleAppUri).then(done);
  });

  it('should have a Login button', function () {
    expect(app.hasLoginButton()).to.eventually.equal(true);
  });

});