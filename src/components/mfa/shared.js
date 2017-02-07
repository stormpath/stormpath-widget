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
