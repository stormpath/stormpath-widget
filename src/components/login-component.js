import Rivets from 'rivets';
import utils from '../utils';
import view from 'html!./login-component.html';
import style from '!style-loader!css-loader!less-loader!./login-component.less';

class LoginComponent {
  static id = 'login-component';
  static view = view;
  static style = style;

  fields = [{
    name: 'login',
    label: 'Username/Email',
    type: 'string',
    value: ''
  }, {
    name: 'password',
    label: 'Password',
    type: 'password',
    value: ''
  }];

  constructor(data) {
    this.id = LoginComponent.id;

    if (data.fields) {
      this.fields = data.fields;
    }
  }

  submit = (event, model) => {
    event.preventDefault();

    const fields = utils.mapArrayToObject(this.fields, 'name');

    console.log('Submitting form!', 'login=', fields.login.value, 'password=', fields.password.value);

    fields.login.value += '1';
  }
}

export default LoginComponent;
