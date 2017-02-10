import EventEmitter from 'events';

class NotificationService extends EventEmitter {
  domLoaded = (...args) => this.emit('domLoaded', ...args);
}

export default NotificationService;
