var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var config = require('./webpack.dev.config');

var app = express();
var compiler = webpack(config);

app.use('/', express.static(__dirname + '/example/login'));

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.listen(3000, function () {
  console.log('Server running on http://localhost:3000/');
});