import chai, { assert } from 'chai';
import Stormpath from '../src/';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Stormpath', () => {
  describe('constructor([options])', () => {
    describe('when options is undefined', () => {

      const stormpath = new Stormpath();

      it('should return a new instance', () => {
        assert.equal(typeof stormpath, 'object');
        assert.equal(stormpath.constructor, Stormpath);
      });

      it('should set default options', () => {
        assert.equal(stormpath.options.baseUri, null);
        assert.equal(stormpath.options.authStrategy, 'cookie');
      });

      describe('getAccessToken()', () => {
        it('should reject with an error', (done) => {
          assert.isRejected(stormpath.getAccessToken(), 'Token storage is not configured.').notify(done);
        });
      });
    });

    describe('when a remote API is defined', () => {

      const stormpath = new Stormpath({
        appUri: 'https://foo.apps.stormpath.io'
      });

      describe('getAccessToken()', () => {
        it('should reject with a token not found error', (done) => {
          assert.isRejected(stormpath.getAccessToken(), 'No access token in storage.').notify(done);
        });
      });
    });
  });

  describe('static', () => {
    describe('.prefix', () => {
      it('should equal sp', () => {
        assert.equal(Stormpath.prefix, 'sp');
      });
    });

    describe('.version', () => {
      it('should equal version in package.json', () => {
        const packageJson = require('json-loader!../package.json');
        assert.equal(Stormpath.version, packageJson.version);
      });
    });
  });
});
