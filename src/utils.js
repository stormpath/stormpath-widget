class Utils {
  // Takes an object array and remaps it to an object based on a key.
  mapArrayToObject(source, key) {
    if (!Array.isArray(source) || typeof key !== 'string') {
      return false;
    }

    const result = {};

    source.forEach((item) => result[item[key]] = item);

    return result;
  }

  // Helper function that returns a bool if an element has a class. Uses classList in supported browsers and falls back to regex in older ones.
  _hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }
  }

  // Adds a class (only once) to an element
  addClass(el, className) {
    if (this._hasClass(el, className)) {
      return false;
    }

    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }

    return true;
  }

  // Removes a class from an element
  removeClass(el, className) {
    if (!this._hasClass(el, className)) {
      return false;
    }

    if (el.classList) {
      el.classList.remove(className);
    } else {
      let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }

    return true;
  }

  getAllPropertyNames(obj) {
    if (typeof obj !== 'object') {
      return false;
    }

    let names = [];

    do {
      names.push.apply(names, Object.getOwnPropertyNames(obj));
      obj = Object.getPrototypeOf(obj);
    } while (obj !== Object.prototype);

    return names.filter(name => name !== 'constructor');
  }

  decoratePublicMethods(decorator, decorated) {
    if (typeof decorator !== 'object' || typeof decorated !== 'object') {
      return false;
    }

    this.getAllPropertyNames(decorated.constructor.prototype).forEach((name) => {
      const member = decorated[name];

      // Skip constructors and private members.
      if (name === 'constructor' || name[0] === '_') {
        return;
      }

      // Skip members overridden in decorator.
      if (name in decorator) {
        return;
      }

      // Skip any members that aren't functions.
      if (typeof member !== 'function') {
        return;
      }

      decorator[name] = member.bind(decorated);
    });

    return true;
  }

  getWindowQueryString() {
    return window.location.search;
  }

  encodeQueryString(query) {
    var result = '';

    for (var key in query) {
      if (result !== '') {
        result += '&';
      }
      result += key + '=' + encodeURIComponent(query[key]);
    }

    return result;
  }

  parseQueryString(queryString) {
    let result = {};

    if (!queryString) {
      return result;
    }

    if (/^[?#]/.test(queryString)) {
      queryString = queryString.slice(1);
    }

    result = queryString.split('&').reduce((params, param) => {
      let [key, value] = param.split('=');

      if (!key) {
        return params;
      }

      try {
        value = decodeURIComponent(value || '');
      } catch (e) {
        value = undefined;
      }

      params[key] = value;

      return params;
    }, {});

    return result;
  }

  prefix(name, prefix, separator) {
    let prefixed = prefix || '';

    if (separator && separator.length) {
      if (prefixed[prefixed.length - separator.length - 1] !== separator) {
        prefixed += separator;
      }
    }

    return prefixed + name;
  }

  isSameDomain(url) {
    var link = window.document.createElement('a');
    link.href = url;
    return window.location.host === link.host;
  }

  bindAll(ref, methods) {
    if (!ref) {
      throw new Error('Must pass an object to bind.');
    }

    if (!methods || !methods.length) {
      throw new Error('Must pass a list of methods to bind.');
    }

    const newObj = {};

    for (let name of methods) {
      const original = ref[name];
      if (!original) {
        continue;
      }

      newObj[name] = original.bind(ref);
    }

    return newObj;
  }
}

export default new Utils();
