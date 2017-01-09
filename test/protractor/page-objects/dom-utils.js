class DomUtils {
  // There isn't really any good way to compare the equality of two DOM objects.
  // This is a hack to circumvent that.
  static isSameElement(a, b) {
    return Promise.all([
      a.getAttribute('outerHTML'),
      b.getAttribute('outerHTML')
    ]).then((results) => {
      return Promise.resolve(results[0] === results[1]);
    });
  }
}

export default DomUtils;
