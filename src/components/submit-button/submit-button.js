import view from 'html!./submit-button.html';
import style from '!style-loader!css-loader!less-loader!./submit-button.less';

class SubmitButtonComponent {
  static id = 'submit-button';
  static view = view;
  static style = style;

  label = '';
  submitting = false;

  constructor(data) {
    this.label = data.label;
    this.submitting = data.submitting || false;
  }

  handler(e, model) {
    model.clicked = true;
  }
}

export default SubmitButtonComponent;
