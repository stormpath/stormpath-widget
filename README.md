# Stormpath Widget

Add beautiful login, registration, and multi-factor authentication screens to your app in only a few lines of code!


## Installing the widget

Ready to add authentiction to your application?  Simply add a reference to the Stormpath widget in your HTML code:

```html
<script src="https://cdn.stormpath.io/widget/latest/stormpath.min.js"></script>
```

You'll also need to add a little bit of JavaScript code to give the widget your Client API address:

```html
<script>
  var stormpath = window.stormpath = new Stormpath({
    appUri: 'https://foo-bar.apps.stormpath.io'
  });
</script>
```

## Using the widget

> :bulb: To see a full code example, check out our [example page](https://github.com/stormpath/stormpath-widget/blob/master/example/login/index.html).

When you are ready to show a login button, just call `stormpath.showLogin()`:

```html
<button onclick="stormpath.showLogin()">Log in</button>
```

Similarly, to show the registration interface, call `stormpath.showRegistration()`:

```html
<button onclick="stormpath.showRegistration()">Create account</button>
```

When the user successfully authenticates, the widget emits an `authenticated` event. You can use this to update the page. For example, you could show a Log out button once the user logs in by adding this to your `<script>` tag:

```javascript
stormpath.on('authenticated', function() {
  console.log('You\'re authenticated!');

  document.getElementById('logout-btn').style.display = 'block';
});
```

The Log out button would simply need to call `stormpath.logout()`:

```html
<button id="logout-btn" onclick="stormpath.logout()" style="display:none;">Log out</button>
```

To understand everything that the widget is capable of doing, keep reading!

### Modal vs. container mode

By default, the widget will display a modal (pop-up) on your page. If you want, you can display the widget inside of an existing `<div>` or other DOM element on your page. To do this, pass a DOM node to the widget via the `container` parameter:

```javascript
var stormpath = window.stormpath = new Stormpath({
  appUri: 'https://foo-bar.apps.stormpath.io',
  container: document.getElementById('widget')
});
```

You can remove the rendered elements from the DOM at any time by calling `stormpath.remove()`.

## Reference

### API

#### new Stormpath(options)

Creates a new instance of the Stormpath widget, but doesn't show anything until invoked with a `showXYZ` method. The allowed options are:

* **appUri** - The address of your web server or Stormpath application (like `foo-bar.apps.stormpath.io`). If left blank, the widget will attempt to connect to a server running on the current domain.
* **container** - Pass a DOM element to render the widget to. If null, the widget will default to modal mode.
* **authStrategy** - Either `cookie`, `token`. If null, the widget will automatically pick the best strategy to use (`cookie` when connecting to a server on the same domain, `token` when connecting cross-domain).

#### getAccount()

Gets the user's details, if a user is currently logged in.

#### getAccessToken()

Gets the user's access token, if a user is currently logged in.

#### logout()

Logs the user out.

#### showLogin()

Shows the login interface.

#### showRegistration()

Shows the registration interface.

#### showForgotPassword()

Shows the password reset interface.

#### showChangePassword(sptoken)

Trigger the last step of the password reset workflow. The widget fetches the `sptoken` from the URL if it's not passed explicitly.

To distinguish from password reset, we recommend that you set the [Link Base URL of your directory](https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#customizing-stormpath-email-templates) to `http://example.com#change-password`, and then invoke the widget like so:

```javascript
if ((/#change-password/).test(window.location.href)) {
  stormpath.showChangePassword();
}
```

#### showEmailVerification(sptoken)

Trigger the email verification workflow. This is used when the user is landing on your app after clicking the email verification link. The widget fetches the `sptoken` from the URL if it's not passed explicitly.

To distinguish from password reset, we recommend that you set the [Link Base URL of your directory](https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#customizing-stormpath-email-templates) to `http://example.com#verify`, and then invoke the widget like so:

```javascript
if ((/#verify/).test(window.location.href)) {
  stormpath.showEmailVerification();
}
```

#### remove()

Removes the widget from the DOM. This is useful when you are rendering the widget to your own container element.

### Events

These are the events that are emitted from the `Stormpath` instance.

```javascript
stormpath.on('loggedIn', function onLoggedIn() {
  console.log('User logged in!');
});
```

#### `authenticated`

This event is either emitted directly when the Stormpath instance is created and a session is present, or after a user logs in.

#### `unauthenticated`

This event is either emitted directly when the Stormpath instance is created and no session is present, or after a user logs out.

#### `registered`

This event is emitted when a new account is created.

#### `loggedIn`

This event is emitted once a user logs in.

#### `loggedOut`

This event is emitted once a user logs out.

## Contributing

You can build and test the widget by cloning this repository and running:

```term
$ npm i
$ npm run dev
```

Open a browser and navigate to http://localhost:3000 to view the demo.

`npm run dev` compiles all of the JS/HTML/CSS assets into `dist/stormpath.dev.js` and instructs Webpack to watch the `src` directory for changes.

### Running tests

To run the test suite, execute:

```term
$ npm test
$ npm run protractor
```

### Building

TODO
