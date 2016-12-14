var webpack = require('webpack');

module.exports = {
  output: {
    library: 'Stormpath'
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        retainLines: true,
        cacheDirectory: true
      }}
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'pkg.version': JSON.stringify(require('./package.json').version)
    })
  ]
};
