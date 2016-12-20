import utils from '../../utils';
import view from 'html!./verify-email.html';
import style from '!style-loader!css-loader!less-loader!./verify-email.less';

class VerifyEmailComponent {
  static id = 'verify-email-component';
  static view = view;
  static style = style;

  state = null;
  token = null;

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

  onVerificationSuccess() {
    this.state = 'verified';
  }

  onVerificationError() {
    this.state = 'error';
  }
}

export default VerifyEmailComponent;
