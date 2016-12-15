class CookieUserService {
  constructor(httpProvider) {
    this.httpProvider = httpProvider;
  }

  getLoginViewModel() {
    return this.httpProvider.getJson('/login');
  }

  login(username, password) {
    return this.httpProvider.postJson('/login', {
      username,
      password
    });
  }
}

export default CookieUserService;
