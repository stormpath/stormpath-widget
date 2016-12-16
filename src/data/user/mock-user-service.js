import EventEmitter from 'events';

class MockUserService extends EventEmitter {
  constructor() {
    super();
    this.authenticated = false;
  }

  getState() {
    this.emit(this.authenticated ? 'authenticated' : 'unauthenticated');
    return Promise.resolve(this.authenticated ? 'authenticated' : 'unauthenticated');
  }

  getRegistrationViewModel() {
    return new Promise((accept) => {
      accept({
      });
    });
  }

  me() {
    return new Promise((accept) => {
      accept({
        account: {
          href: 'https://api.stormpath.com/v1/accounts/5tNTKayRIkNQIcjjcvaaMz',
          createdAt: '2016-12-16T12:25:40.292Z',
          modifiedAt: '2016-12-16T12:25:40.292Z',
          username: 'robin+test@stormpath.com',
          email: 'robin+test@stormpath.com',
          givenName: 'Robin',
          middleName: null,
          surname: 'Test',
          status: 'ENABLED',
          fullName: 'Robin Test',
          emailVerificationStatus: 'UNVERIFIED',
          passwordModifiedAt: '2016-12-16T12:25:40.000Z'
        }
      });
    });
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
        this.authenticated = true;
        this.emit('loggedIn');
        this.emit('authenticated');
        accept();
      } else {
        this.authenticated = false;
        reject({message:'Invalid username or password.'});
      }
    });
  }

  register(data) {
    return new Promise((accept) => {
      this.emit('registered');
    });
  }

  logout() {
    this.authenticated = false;
    this.emit('loggedOut');
    this.emit('unauthenticated');
    return Promise.resolve();
  }
}

export default MockUserService;
