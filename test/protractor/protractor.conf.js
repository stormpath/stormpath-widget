import q from 'q';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ExampleServer from './example-server';

chai.use(chaiAsPromised);

export const config = {
  directConnect: true,
  framework: 'mocha',
  specs: ['./tests/*.js'],
  exclude: [],

  mochaOpts: {
    reporter: 'spec',
    timeout: 20000
  },

  params:{
    // anything in here gets attached to browser.params
  },

  capabilities: {
    browserName: 'chrome',
    version: '41',
    platform: 'OS X 10.10',
    name: 'chrome-tests'
  },

  onPrepare: () => {
    browser.ignoreSynchronization = true;
    const port = process.env.PORT || 3000;
    browser.params.exampleAppUri = process.env.EXAMPLE_APP_URI || 'http://localhost:' + port;
    return new ExampleServer(port);
  },

  onCleanUp: (exitCode) => {
    // Boilerplate promise, will be used later when we
    // need to do any cleanup
    var deferred = q.defer();

    deferred.resolve(exitCode);

    return deferred.promise;
  }
};
