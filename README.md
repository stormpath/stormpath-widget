# Stormpath Widget

Add beautiful login, registration, and multi-factor authentication screens to your app in a few lines of code!


## Installing the widget

Ready to add authentiction to your application?  Simply add a reference to the Stormpath widget in your HTML code:

```html
<script src="https://cdn.stormpath.io/widget/latest/stormpath.min.js"></script>
```

You'll also need to add a little bit of JavaScript code to give the widget your Client API address:

```html
<script>
  var stormpath = window.stormpath = new Stormpath({
    appUri: 'https://foo-bar.apps.stormpath.io',
  });
</script>
```

## Using the widget

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
    
    document.getElementById('logout-button').style.display = 'block';
  });
```

The Log out button would simply need to call `stormpath.logout()`:

```html
<button onclick="stormpath.logout()" style="display:none">Log out</button>
```

To understand everything that the widget is capable of doing, keep reading!


## Reference

### API

#### new Stormpath(options)

Creates a new instance of the Stormpath widget, but doesn't show anything until invoked with a `showXYZ` method. The allowed options are:

* **appUri** - The 
