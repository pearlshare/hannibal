var object = require("./object");
var stringLength = require('string-length');

module.exports = {
  allOf: object.allOf,
  anyOf: object.anyOf,
  oneOf: object.oneOf,
  not: object.not,
  min: function minStringLength (value, length) {
    if (stringLength(value) < length) {
      throw new Error("string is too short, requires: " + length + " chars and was: " + value.length);
    }
  },
  max: function maxStringLength (value, length) {
    if (stringLength(value) > length) {
      throw new Error("string is too long, requires: " + length + " chars and was: " + value.length);
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
  },
  const: function (value, input) {
    if (value !== input) {
      throw new Error("const: not equal");
    }
  }
};
