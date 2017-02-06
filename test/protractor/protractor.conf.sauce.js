import { config as baseConfig } from './protractor.conf.js';
import os from 'os';

baseConfig.directConnect = false;

baseConfig.sauceUser = process.env.SAUCE_USERNAME;
baseConfig.sauceKey = process.env.SAUCE_ACCESS_KEY;

delete baseConfig.capabilities;

baseConfig.sauceBuild = baseConfig.pkg.name;

if (process.env.TRAVIS_PULL_REQUEST !== 'false') {
  baseConfig.sauceBuild += ` (travis PR ${process.env.TRAVIS_PULL_REQUEST})`;
} else if (process.env.TRAVIS_COMMIT) {
  baseConfig.sauceBuild += ` (travis commit ${process.env.TRAVIS_COMMIT})`;
} else {
  baseConfig.sauceBuild += ` (${os.hostname()} ${new Date().toISOString()})`;
}

/* eslint-disable no-console */
console.log(`Running SauceLabs build ${baseConfig.sauceBuild}`);

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
    browserName: 'MicrosoftEdge',
    version: '14',
    platform: 'Windows 10',
    avoidProxy: true
  },
  // {
  //   browserName: 'internet explorer',
  //   version: '11.0',
  //   platform: 'Windows 7',
  //   avoidProxy: true,
  // },
  {
    browserName: 'safari',
    version: 'latest',
    platform: 'macOS 10.12'
  }
];

export const config = baseConfig;
