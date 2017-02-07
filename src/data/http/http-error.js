import utils from '../../utils';

class HttpError {
  constructor(status, body) {
    //super();

    // Fix according to http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
    /*this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }*/

    this.status = status;
    this._trySetValuesFromBody(body);
  }

  _trySetValuesFromBody(body) {
    if (typeof body === 'string') {
      const parsedBody = utils.tryParseJson(body);
      if (parsedBody) {
        body = parsedBody;
      }
    }

    if (body && typeof body === 'object') {
      for (var key in body) {
        if (!(key in this)) {
          this[key] = body[key];
        }
      }

      if (!this.type) {
        this.type = 'unknown';
      }

      if (!this.message) {
        this.message = JSON.stringify(body);
      }
    } else {
      this.type = 'unknown';
      this.message = body || 'Error not available.';
    }
  }
}

export default HttpError;
