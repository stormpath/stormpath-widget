import utils from '../../utils';
import view from 'html!./login.html';
import style from '!style-loader!css-loader!less-loader!./login.less';

class LoginComponent {
  static id = 'login-component';
  static view = view;
  static style = style;

  fields = [];
  state = 'unknown';
  modal = null;

  constructor(data) {
    this.userService = data.userService;
    this.modal = data.modal;

    this.state = 'loading';

    this.userService.getState().then((state) => {
      if (state === 'authenticated') {
        this.state = 'authenticated';
        return;
      }

      // I think this would be a good way to allow the
      // developer to override the remote field config
      if (data.fields) {
        this.fields = data.fields;
        this.onViewModelLoaded({form: { fields: data.fields }});
        return;
      }

      this.userService.getLoginViewModel()
        .then(this.onViewModelLoaded.bind(this))
        .catch(this.onError.bind(this, 'loading_error'));
    });
  }

  onError(state, err) {
    this.error = err;
    this.state = state;
  }

  onViewModelLoaded(data) {
    this.fields = data.form.fields;
    this.state = 'ready';
  }

  onAuthenticated() {
    this.state = 'authenticated';
    if (this.modal) {
      this.modal.close();
    }
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const username = fields.login.value;
    const password = fields.password.value;

    this.userService.login(username, password)
      .then(this.onAuthenticated.bind(this))
      .catch(this.onError.bind(this, 'login_error'));
  }
}

export default LoginComponent;
