import { assert } from 'chai';
import Stormpath from '../src/';

describe('Stormpath', () => {
  describe('constructor([options])', () => {
    describe('when options is undefined', () => {
      it('should return a new instance', () => {
        const stormpath = new Stormpath();
        assert.equal(typeof stormpath, 'object');
        assert.equal(stormpath.constructor, Stormpath);
      });

      it('should set default options', () => {
        const stormpath = new Stormpath();
        assert.equal(stormpath.options.baseUri, null);
        assert.equal(stormpath.authStrategy, 'cookie');
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
