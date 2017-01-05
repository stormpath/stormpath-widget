import q from 'q';
import path from 'path';
import express from 'express';

class ExampleServer {
  constructor(port) {
    const app = this.app = express();
    const deferred = q.defer();

    app.use('/', express.static(path.join(__dirname, '..', '..', 'example', 'login')));

    app.get('/js/app.js', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'dist', 'stormpath.js'));
    });

    app.listen(3000, () => {
      /* eslint no-console: 0 */
      console.log('Server running on port ' + port);
      deferred.resolve();
    });

    return deferred.promise;
  }
}

export default ExampleServer;
