import EventEmitter from 'events';

class CapsLockDetector extends EventEmitter {
  constructor(document) {
    super();

    document.addEventListener('keydown', (event) => {
      if (!event.getModifierState) {
        return;
      }
      
      this.emit('capslock', event.getModifierState('CapsLock'));
    });
  }
}

export default CapsLockDetector;
