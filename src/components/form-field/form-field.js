import view from 'html!./form-field.html';
import CapsLockDetector from '../caps-lock-detector/caps-lock-detector';

class FormFieldComponent {
  static id = 'form-field';
  static view = view;

  field = {};
  namePrefix = '';
  capsWarning = false;

  constructor(data) {
    this.field = data.model;
    this.namePrefix = data.namePrefix + '-';

    if (this.field.isPassword) {
      // TODO would rather not have this bound to document
      new CapsLockDetector(document).on('capslock', this._onCapsLock.bind(this));
    }
  }

  _onCapsLock(capsOn) {
    this.capsWarning = capsOn;
  }
}

export default FormFieldComponent;
