import utils from '../../utils';
import view from 'html!./mfa-enroll.html';
import style from '!style-loader!css-loader!less-loader!./mfa.less';
import { setFactorDefaults } from './shared';

class MfaEnrollComponent {
  static id = 'mfa-enroll-component';
  static view = view;
  static style = style;

  state = null;

  section = null;
  previousSection = null;

  errorMessage = null;

  factors = [];

  selectedFactor = {
    id: null,
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

  navigateBack = () => {
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

  selectFactor = (e) => {
    let id = utils.getClosestDataAttribute(e.srcElement, 'id');
    let selectedFactor = this.factors.find(x => x.id === id);

    this.section = 'setup';
    this.state = selectedFactor.state;
    this.selectedFactor = selectedFactor;

    if (id === 'google-authenticator') {
      this.userService.createFactor(this.state)
        .catch(this.showError.bind(this));
    }
  }

  setSection(section) {
    this.previousSection = this.section;
    this.section = section;
  }

  showComplete = () => {
    this.section = 'complete';
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

    this.errorMessage = err.message;
    this.selectedFactor.isSubmitting = false;

    utils.focusVisibleElement(this.element, 'mfa-focus-target');
  }

  showFactorSecret = (e) => {
    e.preventDefault();
    this.selectedFactor.showSecret = true;
  }

  hideFactorSecret = (e) => {
    e.preventDefault();
    this.selectedFactor.showSecret = false;
  }

  stepBackwards = () => {
    this.selectedFactor.step--;
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    this.errorMessage = null;
    this.selectedFactor.isSubmitting = true;

    let request = {
      state: this.state,
      type: this.selectedFactor.type
    };

    switch (this.selectedFactor.id) {
      case 'sms':
        request.phone = {
          number: this.selectedFactor.phoneNumber
        };

        this.userService.createFactor(request)
          .then((result) => {
            this.state = result.state;
            this.selectedFactor.isSubmitting = false;
            this.selectedFactor.hint = this.selectedFactor.phoneNumber;
            this.viewManager.showChallengeMfa({
              source: 'enroll',
              section: 'challenge',
              state: this.state,
              selectedFactor: this.selectedFactor,
              onBack: () => {
                this.viewManager.showEnrollMfa(this)
              },
              onComplete: () => {
                this.viewManager.showEnrollMfa({
                  section: 'complete',
                  onComplete: this.onComplete
                });
              }
            });
          })
          .catch(this.showError);
        break;

      case 'google-authenticator':
        switch (this.selectedFactor.step) {
          case 1:
            this.userService.createFactor({ type: this.selectedFactor.type }, this.state)
              .then((result) => {
                for (var key in result) {
                  var value = result[key];

                  if (key === 'state') {
                    this.state = value;
                    continue;
                  }

                  this.selectedFactor[key] = value;
                }

                this.selectedFactor.step++;
                this.selectedFactor.isSubmitting = false;
              })
              .catch(this.showError);
            break;

          case 2:
            this.selectedFactor.step++;
            this.selectedFactor.isSubmitting = false;
            break;

          case 3:
            request.code = this.selectedFactor.code;
            this.userService.createChallenge(this.state, request).then((result) => {
              switch (result.status.toLowerCase()) {
                case 'success':
                  this.showComplete();
                  break;

                case 'failed':
                  this.showError(new Error('The code you entered was not valid.'));
                  break;
              }
            });
        }
        break;
    }
  }
}

export default MfaEnrollComponent;
