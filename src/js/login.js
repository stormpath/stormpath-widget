import Rivets from 'rivets';

const element = 'sp-login-view';

class LoginViewController {

  form = {
    fields: [{
      name: 'login',
      label: 'Username/Email',
      type: 'string'
    }, {
      name: 'password',
      label: 'Password',
      type: 'password'
    }]
  }

  submit = (event, model) => {
    event.preventDefault();
    console.log('submit!', this, model);
  }
}


Rivets.components[element] = {
  template: () => require('html!./login.html'),
  initialize: (el, data) => new LoginViewController(data)
};



class LoginComponent {

  constructor() {

    Rivets.init(element, document.body);

  }
} export default LoginComponent;