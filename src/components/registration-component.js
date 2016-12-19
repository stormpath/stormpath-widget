import utils from '../utils';
import view from 'html!./registration-component.html';
import style from '!style-loader!css-loader!less-loader!./registration-component.less';

class RegistrationComponent {
  static id = 'registration-component';
  static view = view;
  static style = style;

  fields = [];
  state = 'unknown';

  constructor(data) {
    this.userService = data.userService;

    this.state = 'loading';

    this.userService.getState().then((state) => {
      // I think this would be a good way to allow the
      // developer to override the remote field config
      if (data.fields) {
        this.fields = data.fields;
        this.onViewModelLoaded({form: { fields: data.fields }});
        return;
      }

      this.userService.getRegisterViewModel()
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

  onRegistrationComplete(result) {
    if (result.status === 'ENABLED') {
      this.state = 'account_enabled';
      // TODO: Automatically login the account in with the provided credentials?
    } else {
      this.state = 'account_pending';
    }
  }

  onFormSubmit = (event) => {
    event.preventDefault();

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
