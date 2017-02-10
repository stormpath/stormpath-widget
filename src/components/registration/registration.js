import utils from '../../utils';
import view from 'html!./registration.html';

class RegistrationComponent {
  static id = 'registration-component';
  static view = view;
  static maxInitialButtons = 4;

  fields = [];
  state = 'unknown';
  accountStores = [];
  passwordPolicy = {};

  // This is necessary because currently Rivets cannot bind to top-level primitives
  // (see https://github.com/mikeric/rivets/issues/700#issuecomment-267177540)
  props = {
    smallButtons: false,
    showButtons: RegistrationComponent.maxInitialButtons,
    showMoreButton: false,
    isSubmitting: false
  };

  constructor(data) {
    this.viewManager = data.viewManager;
    this.userService = data.userService;
    this.autoClose = data.autoClose;

    this.state = 'loading';

    this.userService.getState().then(() => {
      // I think this would be a good way to allow the
      // developer to override the remote field config
      if (data.fields) {
        this.fields = data.fields;
        this.onViewModelLoaded({form: { fields: data.fields }});
        return;
      }

      this.userService.getRegistrationViewModel()
        .then(this.onViewModelLoaded.bind(this))
        .catch(this.onError.bind(this, 'loading_error'));
    });
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
    this.accountStores = data.accountStores;
    utils.shallowCopyInPlace(this.passwordPolicy, data.passwordPolicy);

    this.props.smallButtons = this.accountStores.length > 1;
    this.props.showMoreButton = this.accountStores.length > RegistrationComponent.maxInitialButtons;
    if (this.props.showMoreButton) {
      this.props.showButtons--;
    }

    this.state = 'ready';
  }

  onRegistrationComplete(result) {
    if (result.status === 'ENABLED') {
      const fields = utils.mapArrayToObject(this.fields, 'name');
      this.userService
        .login(fields.email.value, fields.password.value)
        .then(() => {
          if (this.autoClose) {
            this.viewManager.remove();
          }
        });
    } else {
      this.state = 'account_pending';
    }
  }

  onFormSubmit = (event, model) => {
    event.preventDefault();

    model.props.isSubmitting = true;

    const fields = utils.mapArrayToObject(this.fields, 'name');
    const accountData = {};

    for (var key in fields) {
      accountData[key] = fields[key].value;
    }

    this.userService.register(accountData)
      .then(this.onRegistrationComplete.bind(this))
      .catch(this.onError.bind(this, 'validation_error'));
  }
}

export default RegistrationComponent;
