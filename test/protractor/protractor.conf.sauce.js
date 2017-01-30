import { config as baseConfig } from './protractor.conf.js';

baseConfig.directConnect = false;

baseConfig.sauceUser = process.env.SAUCE_USERNAME;
baseConfig.sauceKey = process.env.SAUCE_ACCESS_KEY;

delete baseConfig.capabilities;

baseConfig.multiCapabilities = [
  {
    browserName: 'chrome',
    version: 'latest',
    platform: 'OS X 10.10'
  },
  {
    browserName: 'chrome',
    version: 'latest',
    platform: 'Windows 10'
  },
  {
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 7'
  },
  {
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 10'
  },
  {
    browserName: 'firefox',
    version: 'latest',
    platform: 'OS X 10.10'
  },
  {
    browserName: 'firefox',
    version: 'latest',
    platform: 'OS X 10.10'
  },
  {
    browserName: 'MicrosoftEdge',
    version: '14',
    platform: 'Windows 10',
    avoidProxy: true
  },
  {
    browserName: 'safari',
    version: 'latest',
    platform: 'macOS 10.12'
  }
];

export const config = baseConfig;
