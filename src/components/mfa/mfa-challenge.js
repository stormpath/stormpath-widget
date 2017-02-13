import utils from '../../utils';
import view from 'html!./mfa-challenge.html';
import style from '!style-loader!css-loader!less-loader!./mfa.less';
import { setFactorDefaults } from './shared';

class MfaChallengeComponent {
  static id = 'mfa-challenge-component';
  static view = view;
  static style = style;

  source = null;
  action = null;

  section = null;
  previousSection = null;

  state = null;

  errorMessage = null;
  actionMessage = null;

  factors = [];

  selectedFactor = {
    id: null,
    state: null,
    code: null,
    hint: null,
    isSubmitting: false
  };

  constructor(data, element) {
    this.element = element;

    for (var key in data) {
      this[key] = data[key];
    }

    if (this.selectedFactor) {
      setFactorDefaults(this.selectedFactor);
    }

    if (this.factors) {
      this.factors.forEach(setFactorDefaults);
    }
  }

  reSendSmsCode = () => {
    this.errorMessage = null;
    this.actionMessage = null;
    this.userService.createChallenge(this.state)
      .then((result) => {
        this.state = result.state;
        this.actionMessage = 'Replacement code sent.';
      })
      .catch(this.showError);
  }

  setSection(section) {
    this.previousSection = this.section;
    this.section = section;
  }

  selectFactor = (e) => {
    let id = utils.getClosestDataAttribute(e.srcElement, 'id');
    let selectedFactor = this.factors.find(x => x.id === id);

    this.setSection('challenge');
    this.state = selectedFactor.state;
    this.selectedFactor = selectedFactor;
    this.selectedFactor.isSubmitting = true;

    this.userService.createChallenge(this.state)
      .then((result) => {
        this.selectedFactor.isSubmitting = false;
        this.state = result.state;
      })
      .catch(this.showError);
  }

  resetSelectedFactor() {
    this.selectedFactor = {
      id: null,
      state: null,
      code: null,
      hint: null,
      isSubmitting: false
    };
  }

  navigateBack = () => {
    if (this.onBack) {
      return this.onBack();
    }

    if (!this.previousSection) {
      if (this.autoClose) {
        this.viewManager.remove();
      }
      return;
    }

    this.state = null;
    this.action = null;
    this.resetSelectedFactor();
    this.setSection(this.previousSection);
  }

  showComplete = () => {
    this.setSection('complete');
    this.selectedFactor.isSubmitting = false;
    if (this.onComplete) {
      this.onComplete(this);
    }
  }

  showError = (err) => {
    if (err.error === 'invalid_request') {
      err.message = 'The code you entered was not valid.';
    }

    if (err.message === 'An existing phone with that number is already associated with a factor for that Account.') {
      err.message = 'This phone number has already been added to your account.';
    }

    this.actionMessage = null;
    this.errorMessage = err.message;
    this.selectedFactor.isSubmitting = false;

    utils.focusVisibleElement(this.element, 'mfa-focus-target');
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    this.errorMessage = null;
    this.selectedFactor.isSubmitting = true;

    if (this.source === 'enroll') {
      this.userService.createChallenge(this.state, {
        code: this.selectedFactor.code
      })
      .then((result) => {
        if (result.status === 'FAILED') {
          return this.showError(new Error('The code that you entered was not valid.'));
        }

        this.showComplete();
      })
      .catch(this.showError);
    } else {
      this.userService.loginWithChallenge(this.state, this.selectedFactor.code)
        .then(this.showComplete)
        .catch(this.showError);
    }
  }
}

export default MfaChallengeComponent;
