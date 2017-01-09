import DomObject from './dom';

class ButtonObject extends DomObject {
  constructor(selector, onClickResolver) {
    super(selector);
    this.onClickResolver = onClickResolver;
  }

  click() {
    return this.element.click().then((result) => {
      if (!this.onClickResolver) {
        return result;
      }

      const resolved = this.onClickResolver();

      if (!resolved.waitUntilVisible) {
        return resolved;
      }

      return resolved.waitUntilVisible()
        .then(() => resolved);
    });
  }
}

export default ButtonObject;
