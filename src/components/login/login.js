import utils from '../../utils';
import view from 'html!./login.html';
import style from '!style-loader!css-loader!less-loader!./login.less';

class LoginComponent {
  static id = 'login-component';
  static view = view;
  static style = style;
  static maxInitialButtons = 4;

  fields = [];
  accountStores = [];
  state = 'unknown';
  modal = null;

  // This is necessary because currently Rivets cannot bind to top-level primitives
  // (see https://github.com/mikeric/rivets/issues/700#issuecomment-267177540)
  props = {
    smallButtons: false,
    showButtons: LoginComponent.maxInitialButtons,
    showMoreButton: false,
    isSubmitting: false,
  };

  constructor(data) {
    this.userService = data.userService;
    this.showForgotPassword = data.showForgotPassword;
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

  _onlySupportedAccountStores(stores) {
    return stores.filter((store) => store.authorizeUri);
  }

  toggleMore(e, model) {
    model.props.showMoreButton = false;
    model.props.showButtons = 99;
  }

  onError(state, err) {
    this.error = err;
    this.state = state;
    this.props.isSubmitting = false;
  }

  onViewModelLoaded(data) {
    this.fields = data.form.fields;
    this.accountStores = this._onlySupportedAccountStores(data.accountStores);

    this.props.smallButtons = this.accountStores.length > 1;
    this.props.showMoreButton = this.accountStores.length > LoginComponent.maxInitialButtons;
    if (this.props.showMoreButton) {
      this.props.showButtons--;
    }

    this.state = 'ready';
  }

  onAuthenticated() {
    this.state = 'authenticated';
    if (this.modal) {
      this.modal.close();
    }
  }

  onFormSubmit = (e, model) => {
    e.preventDefault();

    model.props.isSubmitting = true;

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const username = fields.login.value;
    const password = fields.password.value;

    this.userService.login(username, password)
      .then(this.onAuthenticated.bind(this))
      .catch(this.onError.bind(this, 'login_error'));
  }
}

export default LoginComponent;
