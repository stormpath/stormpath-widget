import view from 'html!./password-form-field.html';
import FormFieldComponent from './form-field';
import utils from '../../utils';
import PasswordAnalyzer from '../../data/password-analyzer';

class PasswordFormFieldComponent extends FormFieldComponent {
  static id = 'password-form-field';
  static view = view;

  policy = {};
  value = '';
  analysis = {
    dirty: false
  };

  constructor(data, el, notificationService) {
    super(data, el);

    this.element = el;
    this.policy = data.policy;
    this.notificationService = notificationService;

    this.notificationService.on('viewModelLoaded', this._onViewModelLoaded.bind(this));
  }

  _onViewModelLoaded() {
    const inputField = this.element.querySelector('input');
    if (!inputField) {
      return;
    }

    inputField.addEventListener('input', () => this._onInput.bind(this)());
  }

  _onInput() {
    let analysis = PasswordAnalyzer.analyze(this.value, this.policy);
    utils.shallowCopyInPlace(this.analysis, analysis);
    this.analysis.dirty = true;
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
