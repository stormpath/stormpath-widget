import Stormpath from '../src';
import assert from 'assert';

describe('Stormpath', () => {
  it('should be a constructor', () => {
    assert.equal(typeof Stormpath, 'function');
  });
});