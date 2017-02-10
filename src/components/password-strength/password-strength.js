import view from 'html!./password-strength.html';
import style from '!style-loader!css-loader!less-loader!./password-strength.less';

class PasswordStrengthComponent {
  static id = 'password-strength';
  static view = view;
  static style = style;

  policy = {};

  constructor(data) {
    this.policy = data.policy;
  }
}

export default PasswordStrengthComponent;
