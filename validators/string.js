var stringLength = require('string-length');

module.exports = {
  min: function minStringLength (value, length) {
    var valueLen = stringLength(value);
    if (valueLen < length) {
      throw new Error("string is too short, requires: " + length + " chars and was: " + valueLen);
    }
  },
  max: function maxStringLength (value, length) {
    var valueLen = stringLength(value);
    if (valueLen > length) {
      throw new Error("string is too long, requires: " + length + " chars and was: " + valueLen);
    }
  },
  regex: function regexString (value, regex) {
    var regexp = new RegExp(regex);
    if (!regexp.exec(value)) {
      throw new Error("string does not match regex");
    }
  },
  enum: function enumString (value, values) {
    if (values.indexOf(value) < 0) {
      throw new Error("string: " + value + " is not one of: " + values.join(", "));
    }
  }
};
