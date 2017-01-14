import sinon from 'sinon';
import { assert } from 'chai';
import utils from '../../src/utils';
import AuthStrategy from '../../src/data/auth-strategy';

describe('data/AuthStrategy', () => {
  describe('static', () => {
    describe('constants', () => {
      describe('Token', () => {
        it('should equal token', () => {
          assert.equal(AuthStrategy.Token, 'token');
        });
      });

      describe('Cookie', () => {
        it('should equal cookie', () => {
          assert.equal(AuthStrategy.Cookie, 'cookie');
        });
      });

      describe('Mock', () => {
        it('should equal mock', () => {
          assert.equal(AuthStrategy.Mock, 'mock');
        });
      });
    });

    describe('.resolve(strategy, appUri)', () => {
      it('should exist', () => {
        assert.isFunction(AuthStrategy.resolve);
      });

      describe('when strategy is cookie', () => {
        it('should return cookie', () => {
          const resultStrategy = AuthStrategy.resolve('cookie');
          assert.equal(resultStrategy, AuthStrategy.Cookie);
        });
      });

      describe('when strategy is token', () => {
        it('should return token', () => {
          const resultStrategy = AuthStrategy.resolve('token');
          assert.equal(resultStrategy, AuthStrategy.Token);
        });
      });

      describe('when strategy is mock', () => {
        it('should return mock', () => {
          const resultStrategy = AuthStrategy.resolve('mock');
          assert.equal(resultStrategy, AuthStrategy.Mock);
        });
      });

      describe('when strategy is foo', () => {
        it('should throw an invalid strategy error', () => {
          const errorFn = () => AuthStrategy.resolve('foo');
          assert.throws(errorFn, 'Invalid strategy \'foo\'.');
        });
      });

      describe('when appUri is http://localhost', () => {
        let sandbox;

        beforeEach(() => {
          sandbox = sinon.sandbox.create();
        });

        afterEach(() => {
          sandbox.restore();
        });

        describe('and it is the same domain', () => {
          beforeEach(() => {
            sandbox.stub(utils, 'isSameDomain')
              .withArgs('http://localhost')
              .returns(true);
          });

          describe('and strategy is undefined', () => {
            it('should return cookie', () => {
              const resultStrategy = AuthStrategy.resolve(undefined, 'http://localhost');
              assert.equal(resultStrategy, AuthStrategy.Cookie);
            });
          });

          describe('and strategy is mock', () => {
            it('should return mock', () => {
              const resultStrategy = AuthStrategy.resolve('mock', 'http://localhost');
              assert.equal(resultStrategy, AuthStrategy.Mock);
            });
          });
        });

        describe('and it is not the same domain', () => {
          beforeEach(() => {
            sandbox.stub(utils, 'isSameDomain')
              .withArgs('http://localhost')
              .returns(false);
          });

          describe('and strategy is undefined', () => {
            it('should return token', () => {
              const resultStrategy = AuthStrategy.resolve(undefined, 'http://localhost');
              assert.equal(resultStrategy, AuthStrategy.Token);
            });
          });

          describe('and strategy is mock', () => {
            it('should return mock', () => {
              const resultStrategy = AuthStrategy.resolve('mock', 'http://localhost');
              assert.equal(resultStrategy, AuthStrategy.Mock);
            });
          });
        });
      });

      describe('when both strategy and appUri is undefined', () => {
        it('should return token', () => {
          const resultStrategy = AuthStrategy.resolve();
          assert.equal(resultStrategy, AuthStrategy.Cookie);
        });
      });
    });
  });
});
