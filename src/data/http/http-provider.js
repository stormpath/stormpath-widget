import xhr from 'xhr';
import formUrlencoded from 'form-urlencoded';

class HttpProvider {
  constructor(baseUri) {
    this.baseUri = baseUri || '';
    this.requestInterceptor = null;
  }

  setRequestInterceptor(requestInterceptor) {
    this.requestInterceptor = requestInterceptor;
  }

  getJson(path) {
    return this._createRequest({
      method: 'GET',
      path: path,
      json: true
    });
  }

  postForm(path, data) {
    return this._createRequest({
      method: 'POST',
      path: path,
      body: formUrlencoded(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
  }

  _tryParseJson(data) {
    try {
      return JSON.parse(data);
    } catch (otherErr) {
      return false;
    }
  }

  _createResponseError(err) {
    let type = 'unknown';
    let message = err;

    // If the error is a string, then try to parse it.
    if (typeof err === 'string') {
      const parsedError = this._tryParseJson(err);
      if (parsedError) {
        message = parsedError.message;
        type = parsedError.error;
      }
    }

    const newError = new Error(message);

    newError.type = type;

    return newError;
  }

  _createRequest(options) {
    options.uri = this.baseUri + options.path;

    let waitFor;

    if (this.requestInterceptor && this.requestInterceptor.onBeforeRequest) {
      waitFor = this.requestInterceptor.onBeforeRequest(options);
    } else {
      waitFor = Promise.resolve();
    }

    return waitFor.then(() => {
      return new Promise((accept, reject) => {
        xhr(options, (err, resp, body) => {
          if (err) {
            if (resp && resp.statusCode === 0) {
              err = 'Communication error. Check the API configuration option and allowed origins on your application.';
            }

            return reject(this._createResponseError(err));
          }

          if (resp && resp.statusCode >= 400) {
            return reject(this._createResponseError(body && body.error || body));
          }

          if (typeof body === 'string') {
            const parsedBody = this._tryParseJson(body);
            if (parsedBody !== false) {
              body = parsedBody;
            }
          }

          accept(body);
        });
      });
    });
  }
}

export default HttpProvider;
