import chai, { assert } from 'chai';
import Stormpath from '../src/';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('Stormpath', () => {

  afterEach(() => {
    if (Stormpath.instance) {
      delete Stormpath.instance;
    }
  });

  describe('constructor([options])', () => {
    describe('when called more than once', () => {
      it('should throw error', () => {
        const instantiateTestFn = () => new Stormpath();
        instantiateTestFn();
        assert.throws(instantiateTestFn, 'It\'s only possible to initialize Stormpath once. To retrieve the already initialized instance, use Stormpath.getInstance().');
      });
    });

    describe('when options is undefined', () => {

      let testInstance = null;

      beforeEach(() => {
        testInstance = new Stormpath();
      });

      it('should return a new instance', () => {
        assert.equal(typeof testInstance, 'object');
        assert.equal(testInstance.constructor, Stormpath);
      });

      it('should set default options', () => {
        assert.equal(testInstance.options.baseUri, null);
        assert.equal(testInstance.options.authStrategy, 'cookie');
      });

      it('getAccessToken() should reject with an error', (done) => {
        assert.isRejected(testInstance.getAccessToken(), 'Token storage is not configured.').notify(done);
      });
    });

    describe('when a remote API is defined', () => {

      let testInstance = null;

      beforeEach(() => {
        testInstance = new Stormpath({
          appUri: 'https://foo.apps.stormpath.io'
        });
      });

      describe('getAccessToken()', () => {
        it('should reject with a token not found error', (done) => {
          assert.isRejected(testInstance.getAccessToken(), 'No access token in storage.').notify(done);
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

    describe('.getInstance()', () => {
      describe('when no Stormpath instance has been created', () => {
        it('should return undefined', () => {
          assert.isUndefined(Stormpath.getInstance());
        });
      });

      describe('when a Stormpath instance has been created', () => {
        let testInstance = null;

        beforeEach(() => {
          testInstance = new Stormpath();
        });

        it('should return the previously created instance', () => {
          assert.equal(testInstance, Stormpath.getInstance());
        });
      });
    });
  });
});
