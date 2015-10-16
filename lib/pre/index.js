var lodash = require("lodash");

module.exports = {
  toString: function (value) {
    return String(value);
  },
  toInteger: function (value) {
    return parseInt(value, 10);
  },
  toFloat: function (value) {
    return parseFloat(value);
  },
  toArray: function (value) {
    return [].concat(value);
  },
  capitalize: lodash.capitalize,
  compact: lodash.compact,
  deburr: lodash.deburr,
  escape: lodash.escape,
  kebabCase: lodash.kebabCase,
  toLowerCase: function (value) {
    return String(value).toLowerCase();
  },
  trim: lodash.trim,
  toUpperCase: function (value) {
    return String(value).toUpperCase();
  },
  uniq: lodash.uniq,
  words: lodash.words
};
