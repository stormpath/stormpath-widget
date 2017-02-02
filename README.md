# Stormpath Login Widget

Add beautiful login, registration, and multi-factor authentication screens to your app in only a few lines of code!  To get started, please signup for a free developer account at https://api.stormpath.com/register.

## Table of contents

- [Installing the widget](#installing-the-widget)
- [Using the widget](#using-the-widget)
- [Reference](#reference)
  - [API](#api)
  - [Events](#events)

## Installing the widget

Ready to add authentiction to your application?  Simply add a reference to the Stormpath widget in your HTML code:

```html
<script src="https://cdn.stormpath.io/widget/latest/stormpath.min.js"></script>
```

The login widget uses the [Stormpath Client API][] to authenticate the user.  Every Stormpath Application has a Client API domain, you can find the domain in the Stormpath Admin Console, under the application's "Policies" menu.  Once you have obtained the URL, configure the widget in your front-end application:

```html
<script>
  var stormpath = window.stormpath = new Stormpath({
    appUri: 'https://your-domain.apps.stormpath.io'
  });
</script>
```

## Using the widget

> :bulb: To see a full code example, check out our [example application](example/index.html).

When you are ready to show the login view, just call `stormpath.showLogin()`:

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

#### getAccount() ```Promise.<Account, Error>```

Gets the user's Stormpath account object, if the user is currently logged in.

#### getAccessToken() ```Promise.<JwtString, Error>```

Gets the user's current access token, if a user is currently logged in.  This does not work in if the ``authStrategy`` is `cookie`, in that mode it is assumed that the cookies are not readable by JS (`httpOnly`).  This is likely the case if you are using one of our framework integrations on your server.

#### logout() ```Promise.<null, Error>```

Logs the user out, the access token and refresh tokens are revoked.

#### showLogin()

Shows the login interface.

#### showRegistration()

Shows the registration interface.

#### showForgotPassword()

Shows the password reset interface.

#### showChangePassword(sptoken)

Trigger the last step of the password reset workflow. The widget fetches the `sptoken` from the URL if it's not passed explicitly.

To distinguish from email verification, we recommend that you set the [Link Base URL of your directory](https://docs.stormpath.com/rest/product-guide/latest/accnt_mgmt.html#customizing-stormpath-email-templates) to `http://example.com#change-password`, and then invoke the widget like so:

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

[Stormpath Client API]: https://docs.stormpath.com/client-api/product-guide/latest/
