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

    let start = this._uri.indexOf('?');
    start = this._uri.indexOf(name + '=', start);
    if (start === -1) {
      return result;
    }

    let end = this._uri.length;
    let nextParam = this._uri.indexOf('&', start);
    if (nextParam > -1) {
      end = nextParam;
    }

    let fragment = this._uri.indexOf('#', start);
    if (fragment > -1 && fragment <= end) {
      end = fragment;
    }

    result.value = this._uri.substring(start + name.length + 1, end);

    var trimmedStart = this._uri.substring(0, start);
    var trimmedEnd = this._uri.substring(end);
    result.new = trimmedStart + trimmedEnd;

    result.new = result.new
      .replace('?&', '?')
      .replace('?#', '#')
      .replace('&&', '&')
      .replace('&#', '#');

    if (result.new[result.new.length - 1] === '&'
     || result.new[result.new.length - 1] === '?') {
      result.new = result.new.slice(0, -1);
    }

    return result;
  }
}

export default UriParser;
