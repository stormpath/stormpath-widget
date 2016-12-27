import utils from '../../utils';
import view from 'html!./change-password.html';
import style from '!style-loader!css-loader!less-loader!./change-password.less';

class ChangePasswordComponent {
  static id = 'change-password-component';
  static view = view;
  static style = style;

  fields = [{
    label: 'New Password',
    name: 'password',
    required: true,
    type: 'password'
  }, {
    label: 'Confirm New Password',
    name: 'passwordConfirm',
    required: true,
    type: 'password'
  }];

  state = 'unknown';

  constructor(data) {
    this.userService = data.userService;
    this.showLogin = data.showLogin;
    this.showForgotPassword = data.showForgotPassword;
    this.token = data.token;
    this._beginVerifyToken();
  }

  _setState = (state) => {
    this.state = state;
  }

  _beginVerifyToken() {
    this._setState('verifying');
    this.userService.verifyPasswordResetToken(this.token)
      .then(this._setState.bind(this, 'verified'))
      .catch(this._setState.bind(this, 'invalid_token'));
  }

  onError(state, err) {
    this.error = err;
    this._setState(state);
  }

  onPasswordChanged() {
    this._setState('changed');
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const password = fields.password.value;
    const passwordConfirm = fields.passwordConfirm.value;

    if (password !== passwordConfirm) {
      return this.onError('validation_error', {
        message: 'Passwords do not match'
      });
    }

    this._setState('sending');

    const request = {
      sptoken: this.token,
      password: password
    };

    this.userService.changePassword(request)
      .then(this.onPasswordChanged.bind(this))
      .catch(this.onError.bind(this, 'request_error'));
  }
}

export default ChangePasswordComponent;
