import view from 'html!./form-fields.html';
import style from '!style-loader!css-loader!less-loader!./form-fields.less';

class FormFieldsComponent {
  static id = 'form-fields';
  static view = view;
  static style = style;

  fields = {};
  namePrefix = '';
  passwordPolicy = {};

  constructor(data) {
    this.fields = data.fields;
    this.namePrefix = data.namePrefix;
    this.passwordPolicy = data.passwordPolicy;
  }
}

export default FormFieldsComponent;
