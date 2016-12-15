var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    './src/index'
  ],

  output: {
    path: __dirname,
    filename: 'app.js',
    publicPath: '/js/',
    library: 'Stormpath'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        retainLines: true,
        cacheDirectory: true
      }
    }]
  },

  plugins: [
    new webpack.DefinePlugin({
      'pkg.version': JSON.stringify(require('./package.json').version)
    })
  ]
};
