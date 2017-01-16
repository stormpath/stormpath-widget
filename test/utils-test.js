import { assert } from 'chai';
import utils from '../src/utils';

describe('utils', () => {
  describe('.mapArrayToObject(source, key)', () => {
    const mockKey = '946a51a5-e98f-4e7c-9fec-707734f3436a';

    describe('when source is not an array', () => {
      it('should return false', () => {
        const invalidValues = [undefined, null, true, 1, '', {}, function () {}];
        invalidValues.forEach((invalidValue) => {
          assert.equal(utils.mapArrayToObject(invalidValue, mockKey), false);
        });
      });
    });

    describe('when key is not a string', () => {
      it('should return false', () => {
        const mockSource = [];
        const invalidValues = [undefined, null, true, 1, {}, function () {}];
        invalidValues.forEach((invalidValue) => {
          assert.equal(utils.mapArrayToObject(mockSource, invalidValue), false);
        });
      });
    });

    describe('when source is [{a: \'a\'} and key is \'a\'', () => {
      it('should return {a: {a: \'a\'}}', () => {
        const result = utils.mapArrayToObject([{a: 'a'}], 'a');
        assert.deepEqual(result, {a: {a: 'a'}});
      });
    });
  });

  describe('.addClass(el, className)', () => {
    describe('when el is [DOMNode] and className is \'abc\'', () => {
      let mockElement;
      let mockClass;
      let result;

      beforeEach(() => {
        mockElement = document.createElement();
        mockClass = 'abc';
        result = utils.addClass(mockElement, mockClass);
      });

      it('should add class \'abc\' to el.className', () => {
        assert.equal(mockElement.className, mockClass);
      });

      it('should add class \'abc\' to el.classList', () => {
        assert.equal(mockElement.classList[0], mockClass);
      });

      it('should return true', () => {
        assert.isTrue(result);
      });

      describe('when other classes are present', () => {
        beforeEach(() => {
          mockElement = document.createElement();
          utils.addClass(mockElement, 'a');
          utils.addClass(mockElement, 'b');
          result = utils.addClass(mockElement, mockClass);
        });

        it('should append \'abc\' to el.className', () => {
          assert.equal(mockElement.className, 'a b ' + mockClass);
        });

        it('should append \'abc\' to el.classList', () => {
          assert.equal(mockElement.classList[0], 'a');
          assert.equal(mockElement.classList[1], 'b');
          assert.equal(mockElement.classList[2], mockClass);
        });

        it('should return true', () => {
          assert.isTrue(result);
        });
      });

      describe('when class \'abc\' already present', () => {
        beforeEach(() => {
          result = utils.addClass(mockElement, mockClass);
        });

        it('should return false', () => {
          assert.isFalse(result);
        });
      });
    });
  });

  describe('.removeClass(el, className)', () => {
    describe('when el is [DOMNode] and className is \'abc\'', () => {
      let mockElement;
      let mockClass;
      let result;

      beforeEach(() => {
        mockElement = document.createElement();
        mockClass = 'abc';
        utils.addClass(mockElement, mockClass);
        result = utils.removeClass(mockElement, mockClass);
      });

      it('should remove existing class \'abc\' from [DOMNode]', () => {
        assert.equal(mockElement.className, '');
        assert.equal(mockElement.classList.length, 0);
      });

      it('should return true', () => {
        assert.isTrue(result);
      });

      describe('when class \'abc\' isn\'t present', () => {
        beforeEach(() => {
          result = utils.removeClass(mockElement, mockClass);
        });

        it('should return false', () => {
          assert.isFalse(result);
        });
      });
    });
  });

  describe('.getAllPropertyNames(obj)', () => {
    describe('when obj is undefined', () => {
      it('should return false', () => {
        const testObj = undefined;
        assert.equal(utils.getAllPropertyNames(testObj), false);
      });
    });

    describe('when obj is {}', () => {
      it('should return []', () => {
        const testObj = {};
        assert.deepEqual(utils.getAllPropertyNames(testObj), []);
      });
    });

    describe('when obj is { a: function () {}, b: 123 }', () => {
      it('should return [\'a\', \'b\']', () => {
        const testObj = {
          a: function () {},
          b: 123
        };

        assert.deepEqual(utils.getAllPropertyNames(testObj), ['a', 'b']);
      });
    });
  });

  describe('.decoratePublicMethods(decorator, decorated)', () => {
    describe('when decorator is undefined', () => {
      it('should return false', () => {
        assert.equal(utils.decoratePublicMethods(), false);
      });
    });

    describe('when decorated is undefined', () => {
      it('should return false', () => {
        assert.equal(utils.decoratePublicMethods({}), false);
      });
    });

    describe('when decorator is {} and decorated is { a: function () {} }', () => {
      const Foo = function () {};

      it('should preserve the a function in decorated', () => {
        const decorator = new Foo();
        const decorated = new Foo();

        decorated.a = function () {
          return 'a';
        };

        assert.equal(utils.decoratePublicMethods(decorator, decorated), true);

        assert.deepEqual(decorator, {});
        assert.equal(decorated.a(), 'a');
      });
    });

    describe('when decorator is {} and decorated is { foo: function () {...} }', () => {
      const EmptyFoo = function () {};
      const FooWithMethod = function (value) {
        this.value = value;
      };

      FooWithMethod.prototype.foo = function () {
        return this.value;
      };

      it('should set decorated.foo from decorator.foo', () => {
        const decorator = new EmptyFoo();
        const decorated = new FooWithMethod('foo');

        assert.equal(utils.decoratePublicMethods(decorator, decorated), true);

        assert.equal(decorator.foo(), 'foo');
        assert.equal(decorated.foo(), 'foo');
      });
    });
  });

  describe('.getWindowQueryString()', () => {
    it('should return the query string of the current window', () => {
      assert.equal(utils.getWindowQueryString(), window.location.search);
    });
  });

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
        assert.deepEqual(parsedQueryString, { a: '1' });
      });
    });

    describe('when queryString is \'a=1\'', () => {
      it('should return { a: 1 }', () => {
        const parsedQueryString = utils.parseQueryString('a=1');
        assert.deepEqual(parsedQueryString, { a: '1' });
      });
    });

    describe('when queryString is \'a=1&b=2\'', () => {
      it('should return { a: 1, b: 2 }', () => {
        const parsedQueryString = utils.parseQueryString('a=1&b=2');
        assert.deepEqual(parsedQueryString, { a: '1', b: '2' });
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

  describe('.prefix(name, prefix, separator)', () => {
    describe('when prefix is undefined', () => {
      it('should return name', () => {
        const prefixed = utils.prefix('foo');
        assert.equal(prefixed, 'foo');
      });
    });

    describe('when prefix is empty', () => {
      it('should return name', () => {
        const prefixed = utils.prefix('foo', '');
        assert.equal(prefixed, 'foo');
      });
    });

    describe('when prefix is nonempty', () => {
      it('should return name prepended with prefix', () => {
        const prefixed = utils.prefix('foo', 'bar');
        assert.equal(prefixed, 'barfoo');
      });
    });

    describe('when separator is a char', () => {
      it('should return name prepended with separator and prefix', () => {
        const prefixed = utils.prefix('foo', 'bar', '-');
        assert.equal(prefixed, 'bar-foo');
      });
    });

    describe('when separator is a string', () => {
      it('should return name prepended with separator and prefix', () => {
        const prefixed = utils.prefix('foo', 'bar', '--');
        assert.equal(prefixed, 'bar--foo');
      });
    });
  });

  describe('.bindAll(ref, methods)', () => {
    describe('when ref is undefined', () =>  {
      it('should throw', () => {
        assert.throws(() => utils.bindAll());
      });
    });

    describe('when methods is undefined', () => {
      it('should throw', () => {
        assert.throws(() => utils.bindAll({}));
      });
    });

    describe('when ref has no matching functions', () => {
      it('should return an empty object', () => {
        let input = {
          foo: () => true
        };

        let result = utils.bindAll(input, ['bar']);
        assert.deepEqual(result, {});
      });
    });

    describe('when ref has matching functions', () => {
      it('should return those functions', () => {
        let input = {
          foo: () => true
        };

        let result = utils.bindAll(input, ['foo']);
        assert.isFunction(result.foo);
      });
    });
  });
});
