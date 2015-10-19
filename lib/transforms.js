var lodash = require("lodash");

function notNullOrUndefined (value) {
  return value !== null && value !== undefined;
}

module.exports = {
  toString: function (value) {
    if (notNullOrUndefined(value)) {
      return String(value);
    } else {
      return value;
    }
  },
  toInteger: function (value) {
    if (notNullOrUndefined(value)) {
      return parseInt(value, 10);
    } else {
      return value;
    }
  },
  toFloat: function (value) {
    if (notNullOrUndefined(value)) {
      return parseFloat(value);
    } else {
      return value;
    }
  },
  toArray: function (value) {
    if (notNullOrUndefined(value)) {
      return [].concat(value);
    } else {
      return value;
    }
  },
  toDate: function (value) {
    if (notNullOrUndefined(value)) {
      return new Date(value);
    } else {
      return value;
    }
  },
  capitalize: lodash.capitalize,
  compact: lodash.compact,
  deburr: lodash.deburr,
  escape: lodash.escape,
  kebabCase: lodash.kebabCase,
  toLowerCase: function (value) {
    if (notNullOrUndefined(value)) {
      return String(value).toLowerCase();
    } else {
      return value;
    }
  },
  trim: lodash.trim,
  toUpperCase: function (value) {
    if (notNullOrUndefined(value)) {
      return String(value).toUpperCase();
    } else {
      return value;
    }
  },
  uniq: lodash.uniq,
  words: lodash.words
};
