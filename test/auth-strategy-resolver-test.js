import { assert } from 'chai';
import AuthStrategyResolver from '../src/data/auth-strategy-resolver';

const defaultStrategy = AuthStrategyResolver.CookieStrategy;

describe('AuthStrategyResolver', () => {
  describe('when options is null', () => {
    it('should not error', () => {
      assert.doesNotThrow(() => new AuthStrategyResolver());
    });

    it('should default to the cookie strategy', () => {
      const resolver = new AuthStrategyResolver();
      assert.equal(resolver.strategy, defaultStrategy);
    });
  });

  describe('when the user specifies a strategy', () => {
    it('should use the token strategy', () => {
      const resolver = new AuthStrategyResolver({ authStrategy: 'token' });
      assert.equal(resolver.strategy, AuthStrategyResolver.TokenStrategy);
    });

    it('should use the cookie strategy', () => {
      const resolver = new AuthStrategyResolver({ authStrategy: 'cookie' });
      assert.equal(resolver.strategy, AuthStrategyResolver.CookieStrategy);
    });

    it('should use the mock strategy', () => {
      const resolver = new AuthStrategyResolver({ authStrategy: 'mock' });
      assert.equal(resolver.strategy, AuthStrategyResolver.MockStrategy);
    });

    it('should throw for an invalid strategy', () => {
      assert.throw(() => new AuthStrategyResolver({ authStrategy: 'foobar' }));
    });
  });

  describe('when the user does not specify an appUri', () => {
    it('should default to the cookie strategy', () => {
      const resolver = new AuthStrategyResolver({ appUri: '' });
      assert.equal(resolver.strategy, defaultStrategy);
    });
  });

  describe('when the user specifies an appUri', () => {
    it('should throw if isSameDomainTest is not supplied', () => {
      assert.throw(() => new AuthStrategyResolver({ appUri: 'http://foobar' }));
    });

    const isSameDomain = () => true;
    const isNotSameDomain = () => false;

    it('should use the cookie strategy for same-domain uris', () => {
      const resolver = new AuthStrategyResolver({ appUri: 'http://foobar'}, isSameDomain);
      assert.equal(resolver.strategy, AuthStrategyResolver.CookieStrategy);
    });

    it('should use the token strategy for remote-domain uris', () => {
      const resolver = new AuthStrategyResolver({ appUri: 'http://foobar'}, isNotSameDomain);
      assert.equal(resolver.strategy, AuthStrategyResolver.TokenStrategy);
    });

    it('should allow the user to override the strategy', () => {
      const resolver = new AuthStrategyResolver({
        authStrategy: 'token',
        appUri: 'http://foobar',
      }, isSameDomain);
      assert.equal(resolver.strategy, AuthStrategyResolver.TokenStrategy);
    });
  });
});