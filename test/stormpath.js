import assert from 'assert';
import Stormpath from '../src/stormpath';

describe.only('Stormpath', () => {
  describe('constructor([options])', () => {
    describe('when options is undefined', () => {
      it('should return a new instance', () => {
        const stormpath = new Stormpath();
        assert.equal(typeof stormpath, 'object');
        assert.equal(stormpath.constructor, Stormpath);
      });

      it('should set default options', () => {
        const stormpath = new Stormpath();
        const options = stormpath.options;
        assert.equal(options.baseUri, null);
        assert.equal(options.authStrategy, 'cookie');
        assert.equal(typeof options.templates, 'object');
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

  describe('instance', () => {
    describe('.showEmailVerification([renderTo], [token])', () => {
      describe('when renderTo is undefined', () => {
        it.skip('should show and render component to overlay', () => {
        });
      });

      describe('when renderTo is [DOMNode]', () => {
        it.skip('should render component to [DOMNode]', () => {
        });
      });

      describe('when token is undefined', () => {
        it.skip('should pass sptoken from query string to component', () => {
        });
      });

      describe('when token is \'abc\'', () => {
        it.skip('should pass \'abc\' as token to component', () => {
        });
      });
    });
  });
});
