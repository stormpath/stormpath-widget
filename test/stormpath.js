import { assert } from 'chai';
import Stormpath from '../src/';

describe('Stormpath', () => {
  describe('constructor([options])', () => {
    let testInstance = null;

    beforeEach(() => {
      testInstance = new Stormpath();
    });

    afterEach(() => {
      delete Stormpath.instance;
    });

    describe('when options is undefined', () => {
      it('should return a new instance', () => {
        assert.equal(typeof testInstance, 'object');
        assert.equal(testInstance.constructor, Stormpath);
      });

      it('should set default options', () => {
        assert.equal(testInstance.options.baseUri, null);
        assert.equal(testInstance.options.authStrategy, 'cookie');
      });
    });

    describe('when called more than once', () => {
      it('should throw error', () => {
        const instantiateTestFn = () => new Stormpath();
        assert.throws(instantiateTestFn, 'It\'s only possible to initialize Stormpath once. To retrieve the already initialized instance, use Stormpath.getInstance().');
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

        afterEach(() => {
          delete Stormpath.instance;
        });

        it('should return the previously created instance', () => {
          assert.equal(testInstance, Stormpath.getInstance());
        });
      });
    });
  });
});
