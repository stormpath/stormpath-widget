const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

const ExampleApp = require('../page-objects/example-app');
const LoginComponentObject = require('../page-objects/login-component');

chai.use(chaiAsPromised);

describe('Login Component', function () {
  const app = new ExampleApp();
  const loginComponent = new LoginComponentObject();

  beforeEach(function (done) {
    app.loadAt(browser.params.exampleAppUri).then(done);
  });

  it('Should appear when invoked by showLogin()', function () {
    app.clickLoginButton();
    expect(loginComponent.isVisible()).to.eventually.equal(true);

    // This sleep is not required, but for demo purposes this will give you
    // a chance to see the modal before the test exits.

    browser.sleep(1000);
  });

});