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
    type: 'email'
  }];

  // This is necessary because currently Rivets cannot bind to top-level primitives
  // (see https://github.com/mikeric/rivets/issues/700#issuecomment-267177540)
  props = {
    isSubmitting: false
  };

  constructor(data) {
    this.userService = data.userService;
  }

  onError(state, err) {
    this.error = err;
    this.state = state;
    this.props.isSubmitting = false;
  }

  onSent() {
    this.state = 'sent';
  }

  onFormSubmit = (event, model) => {
    event.preventDefault();

    model.props.isSubmitting = true;

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const email = this.email = fields.email.value || '';

    this.state = 'sending';

    this.userService.sendForgotPasswordEmail({ email: email })
      .then(this.onSent.bind(this))
      .catch(this.onError.bind(this, 'post_error'));
  }
}

export default ForgotPasswordComponent;
