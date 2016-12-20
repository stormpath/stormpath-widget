module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: ['./test/**/*.js'],
    webpack: require('./webpack.config'),
    reporters: ['progress'],
    preprocessors: {
      './test/**/*.js': ['webpack']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
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
