# Contributing

You can build and test the widget by cloning this repository and running:

```term
export CLIENT_API_DOMAIN=your-domain.apps.stormpath.io
npm i
npm run dev
```

Open a browser and navigate to http://localhost:3000 to view the demo.

`npm run dev` compiles all of the JS/HTML/CSS assets into `dist/stormpath.dev.js` and instructs Webpack to watch the `src` directory for changes.

### Running tests

`npm test` will run unit/karama tests

#### Protractor

Protractor tests run against builds, so you must first build:

`npm run build`

Then make sure protractor is up to date:

`npm run protractor-update`

Then you can run a quick local test with Chrome only:

`npm run protractor-local`

Or run the full coverage suite on Sauce Labs:

`npm run protractor-sauce`

### Building Releases

`npm build` will compile all of the js/html/css assets into the `dist/stormpath.js` and `dist/stormpath.min.js` files.

TODO

