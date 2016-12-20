import utils from '../../utils';
//import view from 'html!./modal.html';
import style from '!style-loader!css-loader!less-loader!./modal.less';

class ModalComponent {
  //static id = 'modal-component';
  static style = style;

  constructor() {
    this.overlayElement = this._createOverlayElement();
    this.modalElement = this._createModalElement();
  }

  show() {
    utils.addClass(this.overlayElement, 'active');
    utils.addClass(this.modalElement, 'active');
  }

  _createOverlayElement() {
    var overlay = document.createElement('div');
    overlay.className = 'sp-overlay';
    this._addToBody(overlay);

    return overlay;
  }

  _createModalElement() {
    var overlay = document.createElement('div');
    overlay.className = 'sp-modal';
    this._addToBody(overlay);

    return overlay;
  }

  _addToBody = (el) => document.body.insertBefore(el, null);
}

export default ModalComponent;
