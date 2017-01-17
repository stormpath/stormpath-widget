import DomObject from './dom';

class SelectObject extends DomObject {
  constructor(selector) {
    super(selector);
  }

  select(text) {
    return this.element.element(by.cssContainingText('option', text)).click();
  }
}

export default SelectObject;
