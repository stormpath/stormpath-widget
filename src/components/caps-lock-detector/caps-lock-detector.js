import EventEmitter from 'events';

class CapsLockDetector extends EventEmitter {
  constructor(el) {
    super();

    this._state = false;

    el.addEventListener('keydown', (event) => {
      if (!event.getModifierState) {
        return;
      }

      const newState = event.getModifierState('CapsLock');
      if (this._state !== newState) {
        this._state = newState;
        this.emit('capslock', this._state);
      }
    });
  }
}

export default CapsLockDetector;
