module.exports = function (config) {
  config.set({
    basePath: '',
    exclude: ['./test/protractor/**/*'],
    frameworks: ['mocha'],
    files: [
      // Don't watch these, webpack is always watching
      { pattern: './test/**/*.js', watched: false }
    ],
    webpack: require('./webpack.config'),
    reporters: ['progress', 'mocha'],
    preprocessors: {
      './test/**/*.js': ['webpack', 'sourcemap']
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
      'karma-phantomjs-launcher',
      'karma-sourcemap-loader',
      'karma-mocha-reporter'
    ],
    webpackMiddleware: {
      noInfo: true
    }
  });
};
