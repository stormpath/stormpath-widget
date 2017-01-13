class AuthStrategyResolver {
  static TokenStrategy = 'token';
  static CookieStrategy = 'cookie';
  static MockStrategy = 'mock';

  constructor(options, isSameDomainTest) {
    options = options || {};

    this.userStrategy = this.validateUserStrategy(options.authStrategy);
    this.appUri = options.appUri;
    this.isSameDomainTest = isSameDomainTest;

    if (this.appUri && !this.isSameDomainTest) {
      throw new Error('isSameDomainTest argument is required when supplying an appUri.');
    }
  }

  validateUserStrategy(userStrategy) {
    if (!userStrategy) {
      return;
    }

    if (userStrategy === AuthStrategyResolver.TokenStrategy
    || userStrategy === AuthStrategyResolver.CookieStrategy
    || userStrategy === AuthStrategyResolver.MockStrategy) {
      return userStrategy;
    }

    throw new Error('Invalid authStrategy \'' + userStrategy + '\'.');
  }

  get strategy() {
    if (this.userStrategy) {
      return this.userStrategy;
    }

    if (!this.appUri) {
      return AuthStrategyResolver.CookieStrategy;
    }

    return this.isSameDomainTest(this.appUri)
      ? AuthStrategyResolver.CookieStrategy
      : AuthStrategyResolver.TokenStrategy;
  }
}

export default AuthStrategyResolver;
