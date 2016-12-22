# stormpath-widget

Pay you $10 for a better name for this feature

Wiki:

# Developer Readme

*This is the section that will become the offical developer-facing README for this repo, and should be a mirror of the same information that we will put in our onboading materials.*

Ready to add authentiction to your application?  Simply add the Stormpath Widget to your web application, by including this script tag:

```html
<script src="https://cdn.stormpath.io/js/1.0/stormpath.min.js"></script>
```

The widget works with the Stormpath Client API on a per-application basis, so you will need to plug in the name of the CLient API for one of your Stormpath Applications:

```javascript
const stormpath = new Stormpath({
  authStrategy: 'token',
  appUri: 'https://foo.apps.stormpath.io'
});
```

When you are ready for the user to login, simply invoke the login feature of the widget:

```javascript
stormpath.on('unauthenticated', function () {
  stormpath.showLogin();
});
```

### API

#### showLogin([renderTo])

Shows a login form. If `renderTo` is specified, it will render the form to that element. Else it will show the form in an overlay.

#### stormpath.showEmailVerification([renderTo], [sptoken]);

Trigger the email verification workflow, this is when the user is landing on your app after clicking the email verification link. The library fetches the `sptoken` from the URL if it's not passed explicitly.  To distinguish from password reset, we recommend that you set the [Link Base URL of your directory](https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#customizing-stormpath-email-templates) to `http://example.com#verify`, and then use this API like so:

```javascript
if ((/#verify/).test(window.location.href)) {
  stormpath.showEmailVerification();
}
```

#### showRegistration([renderTo])

Shows a registration form. If `renderTo` is specified, it will render the form to that element. Else it will show the form in an overlay.

#### logout()

Logs the user out.

### Events

Supported events that are emitted from the `Stormpath` instance.

```javascript
stormpath.on('loggedIn', function onLoggedIn() {
  console.log('User logged in!');
});
```

#### authenticated

This event is either emitted directly when the Stormpath instance is created and a session is present, or after a user logs in.

#### unauthenticated

This event is either emitted directly when the Stormpath instance is created and no session is present, or after a user logs out.

#### registered

This event is emitted when a new account is created.

#### loggedIn

This event is emitted once a user logs in.

#### loggedOut

This event is emitted once a user logs out.

# Contributing

You can build and test the widget by cloning this repository and running:

```term
$ npm i
$ npm run dev
```

Open a browser and navigate to http://localhost:3000 to view the demo.

`npm run dev` compiles all of the JS/HTML/CSS assets into `dist/stormpath.dev.js` while running webpack with the `--watch` flag.

## Running tests

TODO

## Building

This will compile all of the js/html/css assets into the `dist/stormpath.js` and `dist/stormpath.min.js` files.

TODO
