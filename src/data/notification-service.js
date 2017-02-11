import EventEmitter from 'events';

class NotificationService extends EventEmitter {
  viewModelLoaded = (...args) => this.emit('viewModelLoaded', ...args);
}

export default NotificationService;
