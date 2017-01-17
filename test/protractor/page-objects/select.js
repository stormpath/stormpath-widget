import DomObject from './dom';

class SelectObject extends DomObject {
  constructor(selector) {
    super(selector);
  }

  select(text) {
    return this.element.element(by.cssContainingText('option', text)).click();
  }

  getSelected() {
    return this.element.element(by.css('option:checked'));
  }

  getValue() {
    return this.getSelected().getAttribute('value');
  }
}

export default SelectObject;
