import ngrok from 'ngrok';
import q from 'q';
import stormpath from 'stormpath';

import { config as baseConfig } from './protractor.conf.js';
import ExampleServer from './example-server';

baseConfig.directConnect = false;

baseConfig.sauceUser = process.env.SAUCE_USERNAME;
baseConfig.sauceKey = process.env.SAUCE_ACCESS_KEY;

delete baseConfig.capabilities;

baseConfig.multiCapabilities = [{
  browserName: 'chrome',
  version: 'latest',
  platform: 'OS X 10.10'
}, {
  browserName: 'MicrosoftEdge',
  version: '14',
  platform: 'Windows 10'
}];

const spClient = new stormpath.Client();

baseConfig.onPrepare = () => {

  let deferred = q.defer();

  const port = process.env.PORT || 3000;

  browser.ignoreSynchronization = true;

  // Use ngrox to get a temporary public URL for testing this app


  ngrok.connect(port, (err, url) => {

    if (err) {
      return deferred.reject(err);
    }
    console.log(url);
    browser.params.exampleAppUri = url;
    spClient.getApplication(process.env.STORMPATH_APPLICATION_HREF, (err, application) => {

      if (err) {
        return deferred.reject(err);
      }

      application.authorizedOriginUris.push(url);

      application.save((err) => {
        if (err) {
          return deferred.reject(err);
        }
        new ExampleServer(port).then(deferred.resolve).catch(deferred.reject);
      });
    });

  });

  return deferred.promise;
};

baseConfig.onCleanUp = (exitCode) => {

  var deferred = q.defer();

  // Remove the ngrox proxy url from this application

  spClient.getApplication(process.env.STORMPATH_APPLICATION_HREF, (err, application) => {

    if (err) {
      return deferred.reject(err);
    }

    application.authorizedOriginUris = application.authorizedOriginUris.filter((uri) => !uri.match('ngrok'));

    application.save((err) => {
      if (err) {
        return deferred.reject(err);
      }
      deferred.resolve(exitCode);
    });
  });

  return deferred.promise;
};

export const config = baseConfig;
