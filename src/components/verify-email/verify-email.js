import utils from '../../utils';
import view from 'html!./verify-email.html';
import style from '!style-loader!css-loader!less-loader!./verify-email.less';

class VerifyEmailComponent {
  static id = 'verify-email-component';
  static view = view;
  static style = style;

  state = null;
  token = null;

  fields = [{
    label: 'Username or Email',
    name: 'login',
    placeholder: 'foo@example.com',
    required: true,
    type: 'text'
  }];

  constructor(data) {
    this.userService = data.userService;
    this.token = data.token;
    this.beginVerification();
  }

  beginVerification() {
    if (!this.token) {
      this.state = 'invalid';
      return;
    }

    this.state = 'verifying';

    this.userService.verifyEmail(this.token)
      .then(this.onVerificationSuccess.bind(this))
      .catch(this.onVerificationError.bind(this));
  }

  onSent() {
    this.state = 'sent';
  }

  onVerificationSuccess() {
    this.state = 'verified';
  }

  onVerificationError() {
    this.state = 'error';
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const login = this.login = fields.login.value;

    this.state = 'sending';

    this.userService.sendVerificationEmail({ login: login })
      .then(this.onSent.bind(this))
      .catch(this.onError.bind(this, 'post_error'));
  }
}

export default VerifyEmailComponent;
