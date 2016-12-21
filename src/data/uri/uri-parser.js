class UriParser {
  constructor(uri) {
    this._uri = uri || '';
  }

  hasParameter = (name) => this._uri.indexOf(name + '=') > -1;

  extract(name) {
    let result = {
      original: this._uri,
      new: '',
      value: ''
    };

    let start = this._uri.indexOf(name + '=');
    if (start === -1) {
      return result;
    }

    return result;
  }
}

export default UriParser;
