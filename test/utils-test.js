import assert from 'assert';
import utils from '../src/utils';

describe('utils', () => {
  describe('.encodeQueryString(query)', () => {
    describe('when query is undefined', () => {
      it('should return \'\'', () => {
        const queryString = utils.encodeQueryString();
        assert.equal(queryString, '');
      });
    });

    describe('when query is {}', () => {
      it('should return \'\'', () => {
        const queryString = utils.encodeQueryString({});
        assert.equal(queryString, '');
      });
    });

    describe('when query is { a: 1 }', () => {
      it('should return \'a=1\'', () => {
        const queryString = utils.encodeQueryString({ a: 1});
        assert.equal(queryString, 'a=1');
      });
    });

    describe('when query is { a: 1, b: 2 }', () => {
      it('should return \'a=1&b=2\'', () => {
        const queryString = utils.encodeQueryString({ a: 1 });
        assert.equal(queryString, 'a=1');
      });
    });

    describe('when query is { specialCharacters: \'&?\' }', () => {
      it('should return \'a=1&b=%26%3F&c=234\'', () => {
        const queryString = utils.encodeQueryString({ specialCharacters: '&?' });
        assert.equal(queryString, 'specialCharacters=%26%3F');
      });
    });
  });

  describe('.parseQueryString(queryString)', () => {
    describe('when queryString is undefined', () => {
      it('should return {}', () => {
        const parsedQueryString = utils.parseQueryString();
        assert.deepEqual(parsedQueryString, {});
      });
    });

    describe('when queryString is \'\'', () => {
      it('should return {}', () => {
        const parsedQueryString = utils.parseQueryString('');
        assert.deepEqual(parsedQueryString, {});
      });
    });

    describe('when queryString is \'?a=1\'', () => {
      it('should return { a: 1 }', () => {
        const parsedQueryString = utils.parseQueryString('?a=1');
        assert.deepEqual(parsedQueryString, { a: 1 });
      });
    });

    describe('when queryString is \'a=1\'', () => {
      it('should return { a: 1 }', () => {
        const parsedQueryString = utils.parseQueryString('a=1');
        assert.deepEqual(parsedQueryString, { a: 1 });
      });
    });

    describe('when queryString is \'a=1&b=2\'', () => {
      it('should return { a: 1, b: 2 }', () => {
        const parsedQueryString = utils.parseQueryString('a=1&b=2');
        assert.deepEqual(parsedQueryString, { a: 1, b: 2 });
      });
    });

    describe('when queryString is \'=a\'', () => {
      it('should return {}', () => {
        const parsedQueryString = utils.parseQueryString('=a');
        assert.deepEqual(parsedQueryString, {});
      });
    });

    describe('when queryString is \'a=%\'', () => {
      it('should return { a: undefined }', () => {
        const parsedQueryString = utils.parseQueryString('a=%');
        assert.deepEqual(parsedQueryString, { a: undefined });
      });
    });

    describe('when queryString is \'specialCharacters=%26%3F\'', () => {
      it('should return { specialCharacters: \'&?\' }', () => {
        const parsedQueryString = utils.parseQueryString('specialCharacters=%26%3F');
        assert.deepEqual(parsedQueryString, { specialCharacters: '&?' });
      });
    });
  });
});
