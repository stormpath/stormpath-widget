import utils from '../../utils';
import view from 'html!./mfa-challenge.html';
import style from '!style-loader!css-loader!less-loader!./mfa.less';
import { setFactorDefaults } from './shared';

class MfaChallengeComponent {
  static id = 'mfa-challenge-component';
  static view = view;
  static style = style;

  source = null;
  section = null;
  action = null;

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

  constructor(data) {
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

  selectFactor = (e) => {
    let id = utils.getClosestDataAttribute(e.srcElement, 'id');
    let selectedFactor = this.factors.find(x => x.id === id);

    this.section = 'challenge';
    this.state = selectedFactor.state;
    this.selectedFactor = selectedFactor;

    this.userService.createChallenge(this.state)
      .then((result) => {
        this.state = result.state;
      })
      .catch(this.showError);
  }

  showComplete = () => {
    this.section = 'complete';
    if (this.onComplete) {
      this.onComplete(this);
    }
  }

  showError = (err) => {
    if (err.error === 'invalid_request') {
      err.message = 'The code you entered was not valid.';
    }

    this.actionMessage = null;
    this.errorMessage = err.message;
  }

  onFormSubmit = (event) => {
    event.preventDefault();

    if (this.source === 'enroll') {
      this.userService.createChallenge(this.state, {
        code: this.selectedFactor.code
      })
      .then(this.showComplete)
      .catch(this.showError);
    } else {
      this.userService.loginWithChallenge(this.state, this.selectedFactor.code)
        .then(this.showComplete)
        .catch(this.showError);
    }
  }
}

export default MfaChallengeComponent;
