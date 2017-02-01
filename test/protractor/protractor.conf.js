import q from 'q';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ngrok from 'ngrok';
import stormpath from 'stormpath';

import ExampleServer from './example-server';
import pkg from '../../package.json';

chai.use(chaiAsPromised);

const spClient = new stormpath.Client();

export const config = {
  directConnect: true,
  framework: 'mocha',
  specs: ['./tests/*.js'],
  exclude: [],

  mochaOpts: {
    reporter: 'spec',
    timeout: 20000
  },

  // pkg is not a standard protractor option
  pkg: pkg,

  params:{
    // anything in here gets attached to browser.params
  },

  capabilities: {
    browserName: 'chrome',
    version: '41',
    platform: 'OS X 10.10',
    name: pkg.name
  },


  onPrepare: () => {
    browser.ignoreSynchronization = true;
    const port = Math.floor(Math.random() * 1000) + 3000;

    var deferred = q.defer();

    ngrok.connect(port, (err, url) => {

      browser.params.exampleAppDomain = url;

      spClient.getApplication(process.env.STORMPATH_APPLICATION_HREF, { expand: 'webConfig'}, (err, application) => {
        var clientApiDomain = 'https://' + application.webConfig.domainName;

        application.authorizedOriginUris.push('https://*.ngrok.io');

        application.save((err) => {
          if (err) {
            return deferred.reject(err);
          }

          return new ExampleServer(port, clientApiDomain).then(deferred.resolve, deferred.reject);
        });

      });
    });

    return deferred.promise;
  },


  onCleanUp: (exitCode) => {

    var deferred = q.defer();

    // Remove the ngrox proxy url from this application

    spClient.getApplication(process.env.STORMPATH_APPLICATION_HREF, (err, application) => {

      if (err) {
        return deferred.reject(err);
      }

      application.authorizedOriginUris = application.authorizedOriginUris.filter((uri) => !uri.match('https://*.ngrok.io'));

      application.save((err) => {
        if (err) {
          return deferred.reject(err);
        }
        deferred.resolve(exitCode);
      });
    });

    return deferred.promise;
  }

};
