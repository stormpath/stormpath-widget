import utils from '../../utils';
import view from 'html!./login.html';

class LoginComponent {
  static id = 'login-component';
  static view = view;
  static maxInitialButtons = 4;

  fields = [];
  accountStores = [];
  state = 'unknown';

  // This is necessary because currently Rivets cannot bind to top-level primitives
  // (see https://github.com/mikeric/rivets/issues/700#issuecomment-267177540)
  props = {
    smallButtons: false,
    showButtons: LoginComponent.maxInitialButtons,
    showMoreButton: false,
    isSubmitting: false,
    canRegister: false,
    canRequestPasswordReset: false,
  };

  constructor(data) {
    this.viewManager = data.viewManager;
    this.userService = data.userService;
    this.autoClose = data.autoClose;

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

      this.userService.getRegistrationViewModel()
        .then(() => this.props.canRegister = true)
        .catch(() => this.props.canRegister = false);

      // If we get a 405 from this endpoint on Client API, it means that it is
      // enabled on Client API.  If it 404's, it is not enabled.
      this.userService.getForgotEndpointResponse()
        .catch((err) => this.props.canRequestPasswordReset = err.status === 405);
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
    if (this.autoClose) {
      this.viewManager.remove();
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
