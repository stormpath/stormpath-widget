class PasswordAnalyzer {
  static allowedSymbols = [' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '@', '[', '\\', ']', '^', '_', '{', '|', '}', '~', '¡', '§', '©', '«', '¬', '®', '±', 'µ', '¶', '·', '»', '½', '¿', '×', '÷'];
  static allowedDiacritics = ['À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ'];

  static analyze(password, policy) {
    let analysis = {
      minLength: false,
      maxLength: false,
      bothLength: false,
      minLowerCase: false,
      minUpperCase: false,
      minNumeric: false,
      minSymbol: false,
      minDiacritic: false
    };

    if (!policy['minLength']) {
      analysis.minLength = true;
    } else {
      analysis.minLength = password.length >= policy.minLength;
    }

    if (!policy['maxLength']) {
      analysis.maxLength = true;
    } else {
      analysis.maxLength = password.length <= policy.maxLength;
    }

    analysis.bothLength = analysis.minLength && analysis.maxLength;

    if (!policy['minLowerCase']) {
      analysis.minLowerCase = true;
    } else {
      analysis.minLowerCase = PasswordAnalyzer._countLower(password) >= policy.minLowerCase;
    }

    if (!policy['minUpperCase']) {
      analysis.minUpperCase = true;
    } else {
      analysis.minUpperCase = PasswordAnalyzer._countUpper(password) >= policy.minUpperCase;
    }

    if (!policy['minNumeric']) {
      analysis.minNumeric = true;
    } else {
      analysis.minNumeric = PasswordAnalyzer._countDigits(password) >= policy.minNumeric;
    }

    if (!policy['minSymbol']) {
      analysis.minSymbol = true;
    } else {
      analysis.minSymbol =
        PasswordAnalyzer._countOccurrencesOfAny(password, PasswordAnalyzer.allowedSymbols) >= policy.minSymbol;
    }

    if (!policy['minDiacritic']) {
      analysis.minDiacritic = true;
    } else {
      analysis.minDiacritic =
        PasswordAnalyzer._countOccurrencesOfAny(password, PasswordAnalyzer.allowedDiacritics) >= policy.minDiacritic;
    }

    return analysis;
  }

  static _countLower = (str) => PasswordAnalyzer._countBetween(str, 'a', 'z');

  static _countUpper = (str) => PasswordAnalyzer._countBetween(str, 'A', 'Z');

  static _countDigits = (str) => PasswordAnalyzer._countBetween(str, '0', '9');

  static _countBetween(str, start, end) {
    var count = 0;
    for (var char of str) {
      if (char >= start && char <= end) {
        count++;
      }
    }
    return count;
  }

  static _countOccurrencesOfAny(str, chars) {
    var count = 0;
    for (var char of chars) {
      count += str.split(char).length - 1;
    }
    return count;
  }
}

export default PasswordAnalyzer;
