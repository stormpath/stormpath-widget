var webpackConfig = require('./webpack.config');
webpackConfig.entry = {};

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      //'./app/bundle.js', // TODO this should point to the production file
      './test/**/*.js'],
    webpack: webpackConfig,
    reporters: ['progress'],
    preprocessors: {
      //'./app/bundle.js': ['webpack'], // TODO
      './test/**/*.js': ['webpack']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    plugins: [
      require('karma-webpack'),
      'karma-mocha',
      'karma-phantomjs-launcher'
    ],
    webpackMiddleware: {
      noInfo: true
    }
  });
};
