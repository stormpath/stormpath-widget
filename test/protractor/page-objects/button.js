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

      return this.onClickResolver.then((resolved) => {
        if (!resolved.waitUntilVisible) {
          return resolved;
        }

        return resolved.waitUntilVisible()
          .then(() => resolved);
      });
    });
  }
}

export default ButtonObject;
