import xhr from 'xhr';
import formUrlencoded from 'form-urlencoded';
import utils from '../../utils';
import HttpError from './http-error';
import AuthStrategy from '../auth-strategy';

class HttpProvider {
  constructor(baseUri, authStrategy) {
    this.baseUri = baseUri || '';
    this.authStrategy = authStrategy;
  }

  getJson(path, queryParameters, options) {
    if (queryParameters) {
      path += '?' + utils.encodeQueryString(queryParameters);
    }

    return this._createRequest({
      method: 'GET',
      path: path,
      json: true,
      ...options
    });
  }

  postJson(path, data, options) {
    return this._createRequest({
      method: 'POST',
      path: path,
      body: data,
      json: true,
      ...options
    });
  }

  postForm(path, data, options) {
    if (!options) {
      options = {};
    }

    if (!options.headers) {
      options.headers = {};
    }

    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Accept'] = 'application/json';

    return this._createRequest({
      method: 'POST',
      path: path,
      body: formUrlencoded(data),
      ...options
    });
  }

  _tryParseJson(data) {
    try {
      return JSON.parse(data);
    } catch (otherErr) {
      return false;
    }
  }

  _needsPreflight(options) {
    if (!options || this.authStrategy === AuthStrategy.Cookie) {
      return false;
    }

    const headers = options.headers;
    if (headers && headers['Authorization']) {
      return true;
    }

    if (options.method === 'POST' && options.json) {
      return true;
    }

    return false;
  }

  _createRequest(options) {
    options.uri = this.baseUri + options.path;
    options.headers = options.headers || {};

    if (this._needsPreflight(options)) {
      options.headers['X-Stormpath-Agent'] = `${pkg.name}/${pkg.version}`;
    }

    return new Promise((accept, reject) => {
      xhr(options, (err, resp, body) => {
        if (err) {
          if (resp && resp.statusCode === 0) {
            err = 'Communication error. Check the API configuration option and allowed origins on your application.';
          }

          return reject(new HttpError(resp.statusCode, err));
        }

        if (resp && resp.statusCode >= 400) {
          return reject(new HttpError(resp.statusCode, body && body.error || body));
        }

        if (typeof body === 'string') {
          const parsedBody = utils.tryParseJson(body);
          if (parsedBody !== false) {
            body = parsedBody;
          }
        }

        accept(body);
      });
    });
  }
}

export default HttpProvider;
