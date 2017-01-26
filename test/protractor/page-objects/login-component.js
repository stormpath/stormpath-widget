class LoginComponentObject {
  constructor() {
  }

  isVisible() {
    return element(by.css('.sp-login-component')).isDisplayed();
  }
}

export default LoginComponentObject;
