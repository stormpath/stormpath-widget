import view from 'html!./password-form-field.html';
import FormFieldComponent from './form-field';

class PasswordFormFieldComponent extends FormFieldComponent {
  static id = 'password-form-field';
  static view = view;
}

export default PasswordFormFieldComponent;
