import view from 'html!./password-form-field.html';
import FormFieldComponent from './form-field';

class PasswordFormFieldComponent extends FormFieldComponent {
  static id = 'password-form-field';
  static view = view;

  constructor(data, el) {
    super(data, el);

    this.element = el;
  }

  togglePasswordVisibility(e, model) {
    const el = e.target;

    const passwordFieldElement = model.element.querySelector('#' + model.namePrefix + '-password');
    if (!passwordFieldElement) {
      throw new Error('Could not toggle password field.');
    }

    if (passwordFieldElement.type === 'password') {
      passwordFieldElement.type = 'text';
      el.innerHTML = 'Hide';
    } else {
      passwordFieldElement.type = 'password';
      el.innerHTML = 'Show';
    }
  }
}

export default PasswordFormFieldComponent;
