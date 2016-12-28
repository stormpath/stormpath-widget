import view from 'html!./form-field.html';

class FormFieldComponent {
  static id = 'form-field';
  static view = view;

  namePrefix = '';
  field = {};
  capsWarning = true;

  constructor(data) {
    this.field = data.model;
    this.namePrefix = data.namePrefix + '-';
  }
}

export default FormFieldComponent;
