class ClientApiUserService {
  constructor(httpProvider, storage) {
    httpProvider.setRequestInterceptor(this);
    this.httpProvider = httpProvider;
    this.storage = storage;
  }

  setToken(token) {
    return this.storage.set('stormpath.token', token);
  }

  getToken() {
    return this.storage.get('stormpath.token');
  }

  getState() {
    return this.getToken().then((token) => {
      if (token) {
        return Promise.resolve('authenticated');
      } else {
        return Promise.resolve('unauthenticated');
      }
    });
  }

  onBeforeRequest(request) {
    return this.getToken()
      .then((token) => {
        if (!request.headers) {
          request.headers = {};
        }

        if (token) {
          request.headers['Authorization'] = 'Bearer ' + token;
        }
      })
      .catch(() => Promise.resolve());
  }

  getLoginViewModel() {
    return this.httpProvider.getJson('/login');
  }

  login(username, password) {
    if (username === undefined || password === undefined) {
      return new Promise((_, reject) => {
        reject(new Error('Username or password cannot be empty.'));
      });
    }

    return this.httpProvider.postForm('/oauth/token', {
      grant_type: 'password',
      username,
      password
    }).then((response) => {
      return this.setToken(response.access_token);
    });
  }
}

export default ClientApiUserService;
