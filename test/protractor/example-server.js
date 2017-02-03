import fs from 'fs';
import express from 'express';
import path from 'path';
import q from 'q';

class ExampleServer {
  constructor(port, clientApiDomain) {
    const app = this.app = express();
    const deferred = q.defer();

    /**
     * Fetch the example app, and replace the default CDN script location with the URL
     * where webpack will serve the built JS asset.
     *
     * Also replace the placholder for the Client API domain
     */

    var html = fs.readFileSync(path.join(__dirname, '..', '..', 'example', 'index.html'), 'utf8');

    html = html.replace('YOUR_CLIENT_API_DOMAIN', clientApiDomain);
    html = html.replace(
      '<script src="https://cdn.stormpath.io/widget/0.x/stormpath.min.js"></script>',
     '<script src="js/app.js"></script>');

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
