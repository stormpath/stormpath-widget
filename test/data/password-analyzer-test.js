import { assert } from 'chai';
import PasswordAnalyzer from '../../src/data/password-analyzer';

describe('data/PasswordAnalyzer', () => {
  describe('validates', () => {
    it('above minimum length', () => {
      var result = PasswordAnalyzer.analyze('12345', {
        minLength: 4
      });
      assert.isTrue(result.minLength);
      assert.isTrue(result.bothLength);
    });

    it('below maximum length', () => {
      var result = PasswordAnalyzer.analyze('12345', {
        maxLength: 6
      });
      assert.isTrue(result.maxLength);
      assert.isTrue(result.bothLength);
    });

    it('has enough lowercase', () => {
      var result = PasswordAnalyzer.analyze('Abcdef', {
        minLowerCase: 5
      });
      assert.isTrue(result.minLowerCase);
    });

    it('has enough uppercase', () => {
      var result = PasswordAnalyzer.analyze('aBCDEF', {
        minUpperCase: 5
      });
      assert.isTrue(result.minUpperCase);
    });

    it('has enough digits', () => {
      var result = PasswordAnalyzer.analyze('1234', {
        minNumeric: 3
      });
      assert.isTrue(result.minNumeric);
    });

    it('has enough (mixed) digits', () => {
      var result = PasswordAnalyzer.analyze('ab1c2d3f4', {
        minNumeric: 3
      });
      assert.isTrue(result.minNumeric);
    });

    it('has enough symbols', () => {
      var result = PasswordAnalyzer.analyze('foo=bar!*', {
        minSymbol: 3
      });
      assert.isTrue(result.minSymbol);
    });

    it('has enough diacritics', () => {
      var result = PasswordAnalyzer.analyze('foöbåþ', {
        minDiacritic: 3
      });
      assert.isTrue(result.minDiacritic);
    });
  });

  describe('invalidates', () => {
    it('below minimum length', () => {
      var result = PasswordAnalyzer.analyze('foo', {
        minLength: 4
      });
      assert.isFalse(result.minLength);
      assert.isFalse(result.bothLength);
    });

    it('above maximum length', () => {
      var result = PasswordAnalyzer.analyze('foobar', {
        maxLength: 4
      });
      assert.isFalse(result.maxLength);
      assert.isFalse(result.bothLength);
    });

    it('too few lowercase', () => {
      var result = PasswordAnalyzer.analyze('AAa', {
        minLowerCase: 5
      });
      assert.isFalse(result.minLowerCase);
    });

    it('digits intead of lowercase', () => {
      var result = PasswordAnalyzer.analyze('123', {
        minLowerCase: 1
      });
      assert.isFalse(result.minLowerCase);
    });

    it('too few uppercase', () => {
      var result = PasswordAnalyzer.analyze('AAa', {
        minUpperCase: 5
      });
      assert.isFalse(result.minUpperCase);
    });

    it('too few digits', () => {
      var result = PasswordAnalyzer.analyze('123', {
        minNumeric: 4
      });
      assert.isFalse(result.minNumeric);
    });

    it('too few symbols', () => {
      var result = PasswordAnalyzer.analyze('foo=bar!*', {
        minSymbol: 4
      });
      assert.isFalse(result.minSymbol);
    });

    it('too few diacritics', () => {
      var result = PasswordAnalyzer.analyze('foöbåþ', {
        minDiacritic: 4
      });
      assert.isFalse(result.minDiacritic);
    });
  });
});
