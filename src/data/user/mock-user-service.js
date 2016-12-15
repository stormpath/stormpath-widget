class MockUserService {
  getState() {
    return Promise.resolve('unauthenticated');
  }

  getLoginViewModel() {
    return new Promise((accept) => {
      accept({
        'form': {
          'fields': [{
            'name': 'login',
            'label': 'Username or Email',
            'placeholder': 'Username or Email',
            'required': true,
            'type': 'text'
          }, {
            'name': 'password',
            'label': 'Password',
            'placeholder': 'Password',
            'required': true,
            'type': 'password'
          }]
        },
        'accountStores': [{
          'authorizeUri': 'https://oval-summer.apps.dev.stormpath.io:443/authorize?response_type=stormpath_token&account_store_href=https%3A%2F%2Fdev.i.stormpath.com%2Fv1%2Fdirectories%2FAstrjazg4iZGBGoWYzoxo',
          'provider': {
            'href': 'https://dev.i.stormpath.com/v1/directories/Astrjazg4iZGBGoWYzoxo/provider',
            'providerId': 'github',
            'clientId': 'f53eac119f1df20926ea',
            'scope': 'user:email'
          },
          'href': 'https://dev.i.stormpath.com/v1/directories/Astrjazg4iZGBGoWYzoxo',
          'name': 'Github'
        }]
      });
    });
  }

  login(username, password) {
    return new Promise((accept, reject) => {
      if (username === 'test' && password === 'test') {
        accept();
      } else {
        reject({message:'Invalid username or password.'});
      }
    });
  }
}

export default MockUserService;
