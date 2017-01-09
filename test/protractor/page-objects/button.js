import DomObject from './dom';

class ButtonObject extends DomObject {
  constructor(selector, onClickResolver) {
    super(selector);
    this.onClickResolver = onClickResolver;
  }

  click() {
    return this.element.click().then((result) => {
      if (this.onClickResolver) {
        const resolved = this.onClickResolver();

        if (resolved.waitUntilVisible) {
          return resolved.waitUntilVisible().then(() => {
            return Promise.resolve(resolved);
          });
        }

        return Promise.resolve(resolved);
      }
      return Promise.resolve(result);
    });
  }
}

export default ButtonObject;
