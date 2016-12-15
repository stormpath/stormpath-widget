import xhr from 'xhr';
import formUrlencoded from 'form-urlencoded';

class ClientApi {
  constructor(parameters) {
    this.api = parameters.api || '';
  }
  doXhr(request) {
    request.uri = this.api + request.uri;
    return new Promise((resolve, reject) => {
      xhr(request, (err, resp, body) => {

        if (err) {
          if (resp && resp.statusCode === 0) {
            return reject('API Communication error, check api configuration option and allowed origins on your application.');
          }
          return reject(err);
        }

        if (resp && resp.statusCode >= 400) {
          return reject(body && body.error || body);
        }
        resolve(body);
      });
    });
  }
  getLoginViewModel() {
    return this.doXhr({
      uri: '/login',
      json: true
    });
  }
  authenticate(data) {
    return this.doXhr({
      uri: '/oauth/token',
      method: 'POST',
      body: formUrlencoded(data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
  }
}

export default ClientApi;