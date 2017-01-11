import view from 'html!./container.html';
import style from '!style-loader!css-loader!less-loader!./container.less';

class ContainerComponent {
  static id = 'container';
  static view = view;
  static style = style;

  _element = null;

  constructor(data, el) {
    this._element = el;
    this.test = data.test;
  }
}

export default ContainerComponent;
