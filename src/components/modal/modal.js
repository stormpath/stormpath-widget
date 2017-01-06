import utils from '../../utils';
import view from 'html!./modal.html';
import style from '!style-loader!css-loader!less-loader!./modal.less';

class ModalComponent {
  static style = style;
  static view = view;

  constructor() {
    this._visible = false;
    this._onKeyUpHandler = this._onKeyUp.bind(this);
    this._overlayElement = this._createOverlayElement();
    this._modalElement = this._createModalElement();
  }

  show() {
    if (this._visible) {
      return;
    }

    this._applyTitle();

    utils.addClass(this._overlayElement, 'sp-active');
    utils.addClass(this._modalElement, 'sp-active');

    document.addEventListener('keyup', this._onKeyUpHandler, true);
    this._overlayElement.addEventListener('click', this.close.bind(this), true);
    this._modalElement.focus();

    this._addToBody(this._modalElement);
    this._addToBody(this._overlayElement);

    this._visible = true;
  }

  close() {
    if (!this._visible) {
      return;
    }

    document.removeEventListener('keyup', this._onKeyUpHandler, true);
    this._overlayElement.removeEventListener('click', this.close.bind(this), true);

    utils.removeClass(this._modalElement, 'sp-active');
    utils.removeClass(this._overlayElement, 'sp-active');

    this._removeFromBody(this._modalElement);
    this._removeFromBody(this._overlayElement);

    this._visible = false;
  }

  get element() {
    return this._innerElement;
  }

  _onKeyUp(e) {
    const escapeKeyCode = 27;

    if (e.keyCode !== escapeKeyCode) {
      return;
    }

    e.preventDefault();

    this.close();
  }

  _createOverlayElement() {
    var overlayDiv = document.createElement('div');
    overlayDiv.className = 'sp-overlay';
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

    return modalDiv;
  }

  _applyTitle() {
    // The title of the component is contained in div in the component view.
    // For modals, we want to move that up into the modal title div.
    let title = '&nbsp;'; // TODO do we want some default title text?

    let titleDiv = this._modalElement.getElementsByClassName('sp-title')[0];
    if (titleDiv) {
      title = titleDiv.innerHTML;
    }

    let modalTitleDiv =  this._modalElement.getElementsByClassName('sp-modal-title')[0];
    if (modalTitleDiv) {
      modalTitleDiv.innerHTML = title;
    }
  }

  _addToBody = (el) => document.body.insertBefore(el, null);
  _removeFromBody = (el) => document.body.removeChild(el);
}

export default ModalComponent;
