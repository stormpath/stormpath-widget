import utils from '../utils';
import view from 'html!./login-component.html';
import style from '!style-loader!css-loader!less-loader!./login-component.less';

class LoginComponent {
  static id = 'login-component';
  static view = view;
  static style = style;

  fields;
  error;
  authenticated = false;

  constructor(data) {
    this.id = LoginComponent.id;
    this.api = data.api;

    // I think this would be a good way to allow the
    // developer to override the remote field config
    if (data.fields) {
      this.fields = data.fields;
    } else {
      this.fetching = true;

      // How do we feel about promises?  I do think they read well

      this.api.getLoginViewModel()
        .then((data) => {
          this.fetching = false;
          this.fields = data.form.fields;
        })
        .catch((error) => {
          this.fetching = false; // having to duplicate this is annoying though :( in some implementations we have finally() to do catchall things
          this.error = error;
        });
    }
  }

  submit = (event) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');

    this.api.authenticate({

      grant_type: 'password',
      username: fields.login.value,
      password: fields.password.value

    }).then(() => {
      this.authenticated = true;
    }).catch((error) => this.error = error);

  }
}

export default LoginComponent;
