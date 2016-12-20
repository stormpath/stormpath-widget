import utils from '../../utils';
import view from 'html!./modal.html';
import style from '!style-loader!css-loader!less-loader!./modal.less';

class ModalComponent {
  static style = style;
  static view = view;

  visible = false;

  constructor() {
    this.name = name;
    this.overlayElement = this._createOverlayElement();
    this.modalElement = this._createModalElement();
  }

  show() {
    if (this.visible) {
      return;
    }

    utils.addClass(this.overlayElement, 'active');
    utils.addClass(this.modalElement, 'active');

    this.overlayElement
      .addEventListener('click', this.close.bind(this), true);
    this.modalElement
      .addEventListener('keyup', this._closeOnEsc.bind(this), true);
    this.modalElement.focus();

    this.visible = true;
  }

  close() {
    this.overlayElement
      .removeEventListener('click', this.close.bind(this), true);

    utils.removeClass(this.modalElement, 'active');
    utils.removeClass(this.overlayElement, 'active');

    this._removeElement(this.modalElement);
    this._removeElement(this.overlayElement);
  }

  _closeOnEsc(e) {
    if (e.keyCode !== 27) {
      return;
    }

    e.preventDefault();
    this.close();
  }

  _createOverlayElement() {
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'sp-overlay';
    this._addElement(overlayDiv);
    return overlayDiv;
  }

  _createModalElement() {
    var modalDiv = document.createElement('div');
    modalDiv.className = 'sp-modal';
    modalDiv.innerHTML = view;
    modalDiv.tabIndex = 0;

    // Wire up close button
    modalDiv
      .getElementsByClassName('sp-modal-close-btn')[0]
      .addEventListener('click', this.close.bind(this), false);

    this._addElement(modalDiv);
    return modalDiv;
  }

  _addElement = (el) => document.body.insertBefore(el, null);
  _removeElement = (el) => document.body.removeChild(el);
}

export default ModalComponent;
