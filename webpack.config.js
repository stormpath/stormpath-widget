var webpack = require('webpack');

module.exports = {
  output: {
    library: 'Stormpath'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'pkg.version': JSON.stringify(require('./package.json').version)
    })
  ]
};
