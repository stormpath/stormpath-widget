class Utils {
  // Takes an object array and remaps it to an object based on a key.
  mapArrayToObject(source, key) {
    const result = {};

    source.forEach((item) => result[item[key]] = item);

    return result;
  }
}

export default new Utils();
