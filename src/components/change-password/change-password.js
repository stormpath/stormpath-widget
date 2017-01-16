import utils from '../../utils';
import view from 'html!./change-password.html';
import style from '!style-loader!css-loader!less-loader!./change-password.less';

class ChangePasswordComponent {
  static id = 'change-password-component';
  static view = view;
  static style = style;

  fields = [{
    label: 'Password',
    name: 'password',
    required: true,
    type: 'password'
  }];

  // This is necessary because currently Rivets cannot bind to top-level primitives
  // (see https://github.com/mikeric/rivets/issues/700#issuecomment-267177540)
  props = {
    isSubmitting: false
  };

  state = 'unknown';

  constructor(data) {
    this.viewManager = data.viewManager;
    this.userService = data.userService;
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

    this.props.isSubmitting = false;

    if (err.status === 404) {
      return this._setState('invalid_token');
    }

    this.error = err;
    this._setState(state);
  }

  onPasswordChanged() {
    this._setState('changed');
  }

  onFormSubmit = (event, model) => {
    event.preventDefault();

    model.props.isSubmitting = true;

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const password = fields.password.value;

    this._setState('sending');

    const request = {
      sptoken: this.token,
      password: password
    };

    this.userService.changePassword(request)
      .then(this.onPasswordChanged.bind(this))
      .catch(this.onError.bind(this, 'validation_error'));
  }
}

export default ChangePasswordComponent;
