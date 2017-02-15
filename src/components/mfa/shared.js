const factorDefaults = {
  'sms': {
    iconId: 'sms',
    title: 'SMS text messages',
    description: 'Your carrier\'s standard charges may apply.',
    phoneNumber: null
  },
  'google-authenticator': {
    iconId: 'mobile ',
    title: 'Google Authenticator',
    description: 'A free app from Google.',
    base64QRImage: null,
    secret: null,
    showSecret: false,
    step: 1
  }
};

export function setFactorDefaults(factor) {
  if (!factor.id && !factor.type) {
    return;
  }

  factor.type = factor.type.toLowerCase();

  if (!factor.id) {
    factor.id = factor.type;
  }

  const defaults = factorDefaults[factor.id];

  if (defaults) {
    for (var key in defaults) {
      factor[key] = defaults[key];
    }
  }
}

/**
 * Inspects an MFA error during oauth/token authentication and decides
 * what views should be shown.
 */
export function mfaOauthErrorHandler(err, viewManager) {
  return new Promise((resolve, reject) => {
    switch (err.action) {
      case 'factor_challenge':
        viewManager.showChallengeMfa({
          section: 'challenge',
          state: err.state,
          selectedFactor: {
            id: err.factor.type.toLowerCase(),
            ...err.factor
          },
          onComplete: () => resolve.apply(null, arguments)
        });
        break;

      case 'factor_enroll':
        viewManager.showEnrollMfa({
          section: 'select',
          state: err.state,
          factors: err.allowedFactorTypes.map((id) => {
            return {
              id: id,
              type: id
            };
          }),
          onComplete: () => resolve.apply(null, arguments)
        });
        break;

      case 'factor_select':
        viewManager.showChallengeMfa({
          section: 'select',
          factors: err.factors,
          onComplete: () => resolve.apply(null, arguments)
        });
        break;

      default:
        reject(err);
        break;
    }
  });
}