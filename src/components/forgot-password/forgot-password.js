import utils from '../../utils';
import view from 'html!./forgot-password.html';
import style from '!style-loader!css-loader!less-loader!./forgot-password.less';

class ForgotPasswordComponent {
  static id = 'forgot-password-component';
  static view = view;
  static style = style;

  fields = [{
    label: 'Username or Email',
    name: 'login',
    placeholder: 'foo@example.com',
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
    const login = fields.login.value;

    this.state = 'sending';

    this.userService.sendForgotPasswordEmail({ email: login })
      .then(this.onSent.bind(this))
      .catch(this.onError.bind(this, 'login_error'));
  }
}

export default ForgotPasswordComponent;
