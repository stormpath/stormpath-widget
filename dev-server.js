var fs = require('fs');
var express = require('express');
var path = require('path');
var stormpath = require('stormpath');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var config = require('./webpack.dev.config');

var app = express();
var compiler = webpack(config);
var port = process.env.PORT || 3000;

/**
 * The Client API domain can be provided directly through the environment as CLIENT_API_DOMAIN
 *
 * Or it will be inferred from the Stormpath application that is defined in your environment
 */

var clientApiDomain;

if (process.env.CLIENT_API_DOMAIN) {
  clientApiDomain = 'https://' + process.env.CLIENT_API_DOMAIN;
} else if (process.env.STORMPATH_APPLICATION_HREF) {
  new stormpath.Client().getApplication(process.env.STORMPATH_APPLICATION_HREF, {expand: 'webConfig'}, function (err, application) {
    if (err) {
      throw err;
    }
    clientApiDomain = 'https://' + application.webConfig.domainName;
  });
}

/**
 * Fetch the example app, and replace the default CDN script location with the URL
 * where webpack will serve the built JS asset.
 *
 * Also replace the placholder for the Client API domain
 */
app.get('/', (req, res) => {
  var html = fs.readFileSync(path.join(__dirname, 'example', 'index.html'), 'utf8');
  html = html.replace(
    '<script src="https://cdn.stormpath.io/widget/0.x/stormpath.min.js"></script>',
    '<script src="js/app.js"></script>');
  if (clientApiDomain) {
    html = html.replace('YOUR_CLIENT_API_DOMAIN', clientApiDomain);
  } else {
    console.warn('No Client API domain is defined!');
  }
  res.send(html);
});

app.use('/', express.static(__dirname + '/example'));

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.listen(port, function () {
  console.log('Server running on http://localhost:' + port);
});
