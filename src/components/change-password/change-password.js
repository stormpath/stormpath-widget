import Rivets from 'rivets';

import {
  LoginComponent,
} from '../';

import Stormpath from '../../stormpath';

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
  modal = null;
  validation_error = null;

  constructor(data) {
    this.userService = data.userService;
    this.modal = data.modal;
    this.sptoken = data.sptoken;
    this.verifyToken();
  }

  onError(state, err) {
    this.error = err;
    this.state = state;
  }

  onChanged() {
    this.state = 'changed';
  }

  showLogin() {
    Rivets.init(
      Stormpath.prefix + '-' + LoginComponent.id,
      this.modal.element,
      this
    );
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const password = fields.password.value;
    const passwordConfirm = fields.passwordConfirm.value;

    if (password !== passwordConfirm) {
      this.onError('validation_error', { message: 'Passwords do not match' });
      return;
    }

    this.state = 'sending';

    this.userService.changePassword({
      sptoken: this.sptoken,
      password: password
    })
      .then(this.onChanged.bind(this))
      .catch(this.onError.bind(this, 'request_error'));
  }


  applyState = (state) => this.state = state;

  verifyToken() {
    this.state = 'verifying';
    this.userService.verifyPasswordResetToken(this.sptoken)
      .then(this.applyState.bind(this, 'verified'))
      .catch(this.applyState.bind(this, 'invalid-token'));
  }
}

export default ChangePasswordComponent;