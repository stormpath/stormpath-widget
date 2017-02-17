import EventEmitter from 'events';

class MockUserService extends EventEmitter {
  constructor() {
    super();
    this.authenticated = false;
    this.mostRecentState = null;
  }

  _setState(newState, force, ...args) {
    if (this.mostRecentState !== newState || force) {
      this.mostRecentState = newState;
      this.emit(newState, ...args);
    }
  }


  getState() {
    const newState = this.authenticated ? 'authenticated' : 'unauthenticated';
    return Promise.resolve(newState).then(this._setState.bind(this));
  }

  getRegistrationViewModel() {
    return new Promise((accept) => {
      accept({
        form: {
          fields: [{
            name: 'givenName',
            label: 'First Name',
            placeholder: 'First Name',
            required: false,
            type: 'text'
          }, {
            name: 'surname',
            label: 'Last Name',
            placeholder: 'Last Name',
            required: false,
            type: 'text'
          }, {
            name: 'email',
            label: 'Email',
            placeholder: 'Email',
            required: true,
            type: 'email'
          }, {
            name: 'password',
            label: 'Password',
            placeholder: 'Password',
            required: true,
            type: 'password'
          }]
        },
        accountStores: [{
          authorizeUri: 'https://serene-commander.apps.stormpath.io:443/authorize?response_type=stormpath_token&account_store_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fdirectories%2F4mLvYfHjofeFCOhh2rEust',
          provider: {
            href: 'https://api.stormpath.com/v1/directories/4mLvYfHjofeFCOhh2rEust/provider',
            providerId: 'facebook',
            clientId: '1533729543583787',
            scope: 'public_profile email'
          },
          href: 'https://api.stormpath.com/v1/directories/4mLvYfHjofeFCOhh2rEust',
          name: 'Facebook Test'
        }, {
          authorizeUri: 'https://serene-commander.apps.stormpath.io:443/authorize?response_type=stormpath_token&account_store_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fdirectories%2FqXyToP0p7JtwVHn85A7D9',
          provider: {
            href: 'https://api.stormpath.com/v1/directories/qXyToP0p7JtwVHn85A7D9/provider',
            providerId: 'linkedin',
            clientId: '757nqmqu9tl2y1',
            scope: 'r_basicprofile r_emailaddress'
          },
          href: 'https://api.stormpath.com/v1/directories/qXyToP0p7JtwVHn85A7D9',
          name: 'LinkedIn Test'
        }, {
          authorizeUri: 'https://serene-commander.apps.stormpath.io:443/authorize?response_type=stormpath_token&account_store_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fdirectories%2F7Wy1UMJwdTSaEUtgS1CgHL',
          provider: {
            href: 'https://api.stormpath.com/v1/directories/7Wy1UMJwdTSaEUtgS1CgHL/provider',
            providerId: 'github',
            clientId: '45fd8aeb1e4da562f396',
            scope: 'user:email'
          },
          href: 'https://api.stormpath.com/v1/directories/7Wy1UMJwdTSaEUtgS1CgHL',
          name: 'Github Test'
        }, {
          authorizeUri: 'https://serene-commander.apps.stormpath.io:443/authorize?response_type=stormpath_token&account_store_href=https%3A%2F%2Fapi.stormpath.com%2Fv1%2Fdirectories%2FY8WFCDelIvW0Bajj3n279',
          provider: {
            href: 'https://api.stormpath.com/v1/directories/Y8WFCDelIvW0Bajj3n279/provider',
            providerId: 'google',
            clientId: '1038152768080-fr1d02rrjj2s9pjgn3rv4bacbuo29p0i.apps.googleusercontent.com',
            scope: 'openid email profile',
            hd: null,
            display: null,
            accessType: null
          },
          href: 'https://api.stormpath.com/v1/directories/Y8WFCDelIvW0Bajj3n279',
          name: 'Google Test'
        }, {
          authorizeUri: null,
          provider: {
            href: 'https://api.stormpath.com/v1/directories/30ZrLZt9gIBv9XNatyPWXq/provider',
            providerId: 'saml'
          },
          href: 'https://api.stormpath.com/v1/directories/30ZrLZt9gIBv9XNatyPWXq',
          name: 'OneLogin Demo'
        }]
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

  updateFactor(/*state, options*/) {
    return Promise.resolve({
      state: 'abc'
    });
  }

  login(username/*, password*/) {
    return new Promise((accept, reject) => {
      switch (username) {
        case 'test':
          this.authenticated = true;
          this.emit('loggedIn');
          this.emit('authenticated');
          accept({
            account: {
              href: 'abc'
            }
          });
          break;

        case 'factor_challenge':
          this.authenticated = false;
          reject({
            status: 400,
            error: 'access_denied',
            error_description: 'Action Required',
            action: 'factor_challenge',
            state: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.claims.E1wbgmsoOU7DSEH24EaQ3uMTcSeS1SrPqxGJ3vV_lr0', //see below
            factor: {
              type: 'sms',
              hint: 'xxx-xxx-0959'
            }
          });
          break;

        case 'factor_select':
          this.authenticated = false;
          reject({
            status: 400,
            error: 'access_denied',
            error_description: 'Action Required',
            action: 'factor_select',
            factors: [{
              type: 'sms',
              hint: 'xxx-xxx-0959',
              state: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.claims.E1wbgmsoOU7DSEH24EaQ3uMTcSeS1SrPqxGJ3vV_lr0'
            }, {
              type: 'google-authenticator',
              hint: 'Issuer Value',
              state: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.claims.4EaMTlrcSGJ3OU7VwbEgmsoQ3u0D12eS1SrPSE_Hqxv'
            }]
          });
          break;

        case 'factor_enroll':
          this.authenticated = false;
          reject({
            status: 400,
            error: 'access_denied',
            error_description: 'Action Required',
            action: 'factor_enroll',
            state: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.claims.E1wbgmsoOU7DSEH24EaQ3uMTcSeS1SrPqxGJ3vV_lr0',
            allowedFactorTypes: ['sms']
          });
          break;

        default:
          this.authenticated = false;
          reject({
            message: 'Invalid username or password.'
          });
          break;
      }
    });
  }

  register() {
    return new Promise(() => {
      this.emit('registered');
    });
  }

  getLoginViewModel() {
    return new Promise((accept) => {
      accept({
        form: {
          fields: [{
            name: 'login',
            label: 'Username or Email',
            placeholder: 'Username or Email',
            required: true,
            type: 'text'
          }, {
            name: 'password',
            label: 'Password',
            placeholder: 'Password',
            required: true,
            type: 'password'
          }]
        },
        accountStores: [{
          authorizeUri: 'https://oval-summer.apps.dev.stormpath.io:443/authorize?response_type=stormpath_token&account_store_href=https%3A%2F%2Fdev.i.stormpath.com%2Fv1%2Fdirectories%2FAstrjazg4iZGBGoWYzoxo',
          provider: {
            href: 'https://dev.i.stormpath.com/v1/directories/Astrjazg4iZGBGoWYzoxo/provider',
            providerId: 'github',
            clientId: 'f53eac119f1df20926ea',
            scope: 'user:email'
          },
          href: 'https://dev.i.stormpath.com/v1/directories/Astrjazg4iZGBGoWYzoxo',
          name: 'Github'
        }]
      });
    });
  }

  verifyEmail() {
    return Promise.resolve();
  }

  sendForgotPasswordEmail(data) {
    this._setState('forgotPasswordSent', true, data);
    return Promise.resovle();
  }

  sendVerificationEmail(data) {
    this._setState('verifyEmailSent', true, data);
    return Promise.resolve();
  }

  changePassword(/*data*/) {
    this._setState('passwordChanged', true);
    return Promise.resolve();
  }

  verifyPasswordResetToken(/*token*/) {
    return Promise.resolve();
  }

  createFactor(data) {
    if (data.type === 'google-authenticator') {
      return Promise.resolve({
        base64QRImage: 'iVBOR[...]SuQmCC',
        secret: 'OP7JZ[...]LAV',
        state: 'abc'
      });
    }

    return Promise.resolve({
      state: 'abc'
    });
  }

  createChallenge(/*data*/) {
    return Promise.resolve({
      state: 'abc'
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
