const express = require('express');
const path = require('path');
const q = require('q');

class ExampleServer {
  constructor(port) {
    const app = this.app = express();
    const deferred = q.defer();

    app.use('/', express.static(path.join(__dirname, '..', '..', 'example', 'login')));

    app.get('/js/app.js', function (req, res) {
      res.sendFile(path.join(__dirname, '..', '..', 'dist', 'stormpath.js'));
    });

    app.listen(3000, function () {
      /* eslint no-console: 0 */
      console.log('Server running on port ' + port);
      deferred.resolve();
    });

    return deferred.promise;
  }
}

module.exports = ExampleServer;