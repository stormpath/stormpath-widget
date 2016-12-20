import utils from '../../utils';
import view from 'html!./modal.html';
import style from '!style-loader!css-loader!less-loader!./modal.less';

class ModalComponent {
  static style = style;
  static view = view;

  constructor() {
    this._visible = false;

    this._overlayElement = this._createOverlayElement();
    this._modalElement = this._createModalElement();
  }

  show() {
    if (this._visible) {
      return;
    }

    utils.addClass(this._overlayElement, 'active');
    utils.addClass(this._modalElement, 'active');

    this._overlayElement
      .addEventListener('click', this.close.bind(this), true);
    this._modalElement
      .addEventListener('keyup', this._closeOnEsc.bind(this), true);
    this._modalElement.focus();

    this._visible = true;
  }

  close() {
    this._overlayElement
      .removeEventListener('click', this.close.bind(this), true);

    utils.removeClass(this._modalElement, 'active');
    utils.removeClass(this._overlayElement, 'active');

    this._removeFromBody(this._modalElement);
    this._removeFromBody(this._overlayElement);
  }

  get element() {
    return this._innerElement;
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
    this._addToBody(overlayDiv);
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

    // Save a reference to the inner content div
    this._innerElement = modalDiv
      .getElementsByClassName('sp-modal-content')[0];

    this._addToBody(modalDiv);
    return modalDiv;
  }

  _addToBody = (el) => document.body.insertBefore(el, null);
  _removeFromBody = (el) => document.body.removeChild(el);
}

export default ModalComponent;
