import utils from '../../utils';
import view from 'html!./forgot-password.html';
import style from '!style-loader!css-loader!less-loader!./forgot-password.less';

class ForgotPasswordComponent {
  static id = 'forgot-password-component';
  static view = view;
  static style = style;

  state = 'ready';

  fields = [{
    label: 'Email',
    name: 'email',
    placeholder: '',
    required: true,
    type: 'text'
  }];

  constructor(data) {
    this.userService = data.userService;
  }

  onError(state, err) {
    this.error = err;
    this.state = state;
  }

  onSent() {
    this.state = 'sent';
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const email = fields.email.value || '';

    // Very simple email verification at the moment...
    if (email.indexOf('@') === -1) {
      this.state = 'validation_error';
      this.error = new Error('Invalid email address');
      return;
    }

    this.state = 'sending';

    this.userService.sendForgotPasswordEmail({ email: email })
      .then(this.onSent.bind(this))
      .catch(this.onError.bind(this, 'validation_error'));
  }
}

export default ForgotPasswordComponent;
