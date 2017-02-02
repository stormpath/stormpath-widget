import fs from 'fs';
import express from 'express';
import path from 'path';
import q from 'q';

class ExampleServer {
  constructor(port, clientApiDomain) {
    const app = this.app = express();
    const deferred = q.defer();

    var html = fs.readFileSync(path.join(__dirname, '..', '..', 'example', 'index.html'), 'utf8');

    html = html.replace('YOUR_CLIENT_API_DOMAIN', clientApiDomain);

    // This will render the index.html as the root response:

    app.get('/', (req, res) => {
      res.send(html);
    });

    // This will allow the CSS to be loaded:

    app.use('/', express.static(path.join(__dirname, '..', '..', 'example')));

    app.get('/js/app.js', (req, res) => {
      res.sendFile(path.join(__dirname, '..', '..', 'dist', 'stormpath.js'));
    });

    app.listen(port, () => {
      /* eslint no-console: 0 */
      console.log('Server running on port ' + port);
      deferred.resolve();
    });

    return deferred.promise;
  }
}

export default ExampleServer;
