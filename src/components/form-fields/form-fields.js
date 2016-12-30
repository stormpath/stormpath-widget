import view from 'html!./form-fields.html';

class FormFieldsComponent {
  static id = 'form-fields';
  static view = view;

  fields = {};
  namePrefix = '';

  constructor(data) {
    this.fields = data.fields;
    this.namePrefix = data.namePrefix;
  }
}

export default FormFieldsComponent;
