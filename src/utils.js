class Utils {
  // Takes an object array and remaps it to an object based on a key.
  mapArrayToObject(source, key) {
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
      return;
    }

    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  }

  // Removes a class from an element
  removeClass(el, className) {
    if (!this._hasClass(el, className)) {
      return;
    }

    if (el.classList) {
      el.classList.remove(className);
    } else {
      let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }
}

export default new Utils();
