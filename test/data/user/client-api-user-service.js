import chai, { assert } from 'chai';
import { ClientApiUserService } from '../../../src/data/';
import utils from '../../../src/utils';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe.only('ClientApiUserService', () => {
  describe('View model transformer (_vieModelTransform)', () => {

    const input = {
      accountStores: [{
        authorizeUri: 'foo'
      }, {
        foo: 'bar'
      }]
    };

    const expectedOutput = {
      accountStores: [{
        authorizeUri: 'foo&redirect_uri=' + utils.getCurrentHost()
      }]
    };

    let result;

    before((done) => {
      const userService = new ClientApiUserService();
      userService._vieModelTransform(input).then((_result) => {
        result = _result;
        done();
      }).catch(done);
    });

    it('should remove account stores that dont have an authorize uri', () => {
      assert.equal(result.accountStores.length, 1);
      assert.isDefined(result.accountStores[0].authorizeUri);
    });

    it('should set the redirect_uri to the current host (default beahviour)', () => {
      assert.equal(result.accountStores[0].authorizeUri, expectedOutput.accountStores[0].authorizeUri);
    });
  });

  // it('should reomve account stores that dont have an authorize uri')
});