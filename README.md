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
  api: 'https://foo.apps.stormpath.io'
});
```

When you are ready for the user to login, simply invoke the login feature of the widget:

```javascript
stormpath.login();
```
