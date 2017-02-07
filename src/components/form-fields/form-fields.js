import view from 'html!./form-fields.html';
import style from '!style-loader!css-loader!less-loader!./form-fields.less';

class FormFieldsComponent {
  static id = 'form-fields';
  static view = view;
  static style = style;

  fields = {};
  namePrefix = '';

  constructor(data) {
    this.fields = data.fields;
    this.namePrefix = data.namePrefix;
  }
}

export default FormFieldsComponent;
