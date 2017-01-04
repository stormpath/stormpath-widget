class LoginComponentObject {
  constructor() {
  }

  isVisible() {
    return element(by.css('.sp-modal')).isDisplayed();
  }
}

export default LoginComponentObject;
