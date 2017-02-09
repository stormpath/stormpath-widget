import utils from '../../utils';

class HttpError {
  constructor(status, body) {
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
