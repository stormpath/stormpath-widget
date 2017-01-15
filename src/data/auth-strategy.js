import utils from '../utils';

class AuthStrategy {
  static Token = 'token';
  static Cookie = 'cookie';
  static Mock = 'mock';

  static isValid(strategy) {
    const validStrategies = [
      AuthStrategy.Token,
      AuthStrategy.Cookie,
      AuthStrategy.Mock
    ];

    return validStrategies.includes(strategy);
  }

  static resolve(strategy, appUri) {
    if (strategy) {
      if (!AuthStrategy.isValid(strategy)) {
        throw new Error('Invalid strategy \'' + strategy + '\'.');
      }

      return strategy;
    }

    if (!appUri || utils.isSameDomain(appUri)) {
      return AuthStrategy.Cookie;
    }

    return AuthStrategy.Token;
  }
}

export default AuthStrategy;
