import view from 'html!./submit-button.html';
import style from '!style-loader!css-loader!less-loader!./submit-button.less';

class SubmitButtonComponent {
  static id = 'submit-button';
  static view = view;
  static style = style;

  label = '';
  clicked = false;

  constructor(data) {
    console.log(data);
    this.label = data.label;
  }

  handler(e, model) {
    console.log(e, model);
    model.clicked = true;
  }
}

export default SubmitButtonComponent;
