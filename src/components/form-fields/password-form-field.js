import view from 'html!./password-form-field.html';
import FormFieldComponent from './form-field';

class PasswordFormFieldComponent extends FormFieldComponent {
  static id = 'password-form-field';
  static view = view;

  constructor(data, el) {
    super(data, el);

    this.element = el;
  }

  togglePasswordVisibility(_, model) {
    const passwordFieldElement = model.element.querySelector('#' + model.namePrefix + '-password');
    if (!passwordFieldElement) {
      throw new Error('Could not toggle password field.');
    }

    if (passwordFieldElement.type === 'password') {
      passwordFieldElement.type = 'text';
    } else {
      passwordFieldElement.type = 'password';
    }
  }
}

export default PasswordFormFieldComponent;
