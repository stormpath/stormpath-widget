import view from 'html!./password-form-field.html';
import FormFieldComponent from './form-field';

class PasswordFormFieldComponent extends FormFieldComponent {
  static id = 'password-form-field';
  static view = view;

  policy = {};

  constructor(data, el) {
    super(data, el);

    this.element = el;
    this.policy = data.policy;
  }

  togglePasswordVisibility(e, model) {
    const toggleElement = e.target;

    const passwordFieldElement = model.element.querySelector('#' + model.namePrefix + '-password');
    if (!passwordFieldElement) {
      throw new Error('Could not toggle password field.');
    }

    if (passwordFieldElement.type === 'password') {
      passwordFieldElement.setAttribute('type', 'text');
      passwordFieldElement.setAttribute('autocomplete', 'off');
      toggleElement.innerHTML = 'Hide';
    } else {
      passwordFieldElement.removeAttribute('autocomplete');
      passwordFieldElement.setAttribute('type', 'password');
      toggleElement.innerHTML = 'Show';
    }

    passwordFieldElement.focus();
  }
}

export default PasswordFormFieldComponent;
