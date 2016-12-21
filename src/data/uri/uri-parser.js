class UriParser {
  constructor(uri) {
    this._uri = uri || '';
  }

  hasParameter = (name) => this._uri.indexOf(name + '=') > -1;
}

export default UriParser;
