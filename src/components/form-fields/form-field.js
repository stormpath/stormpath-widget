import view from 'html!./form-field.html';

class FormFieldComponent {
  static id = 'form-field';
  static view = view;

  field = {};
  namePrefix = '';
  value = '';

  constructor(data) {
    this.field = data.model;
    this.namePrefix = data.namePrefix;
    this.value = this.field.value || '';
  }
}

export default FormFieldComponent;
