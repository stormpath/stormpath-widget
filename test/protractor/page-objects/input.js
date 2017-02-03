import DomObject from './dom';

class InputObject extends DomObject {
  setValue(value) {
    return this.element.clear().sendKeys(value);
  }

  getValue() {
    return this.element.getAttribute('value');
  }
}

export default InputObject;
