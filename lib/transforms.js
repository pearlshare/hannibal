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
  toBoolean: function (value) {
    if(lodash.isNumber(value) || (""+value).match(/^[0-9]+$/)) {
      return (value > 0);
    } else if (value === true || /^(true|on|yes|1)$/.test(value)) {
      return true;
    }  else if (value === false || /^(false|off|no|0)$/.test(value)) {
      return false;
    } else {
      return value;
    }
  },
  capitalize: function (value) {
    if (lodash.isString(value)) {
      return lodash.capitalize(value);
    } else {
      return value;
    }
  },
  compact: function (value) {
    if (lodash.isArray(value)) {
      return lodash.compact(value);
    } else {
      return value;
    }
  },
  deburr: function (value) {
    if (lodash.isString(value)) {
      return lodash.deburr(value);
    } else {
      return value;
    }
  },
  escape: function (value) {
    if (lodash.isString(value)) {
      return lodash.escape(value);
    } else {
      return value;
    }
  },
  kebabCase: function (value) {
    if (lodash.isString(value)) {
      return lodash.kebabCase(value);
    } else {
      return value;
    }
  },
  toLowerCase: function (value) {
    if (lodash.isString(value)) {
      return value.toLowerCase();
    } else {
      return value;
    }
  },
  trim: function (value) {
    if (lodash.isString(value)) {
      return lodash.trim(value);
    } else {
      return value;
    }
  },
  toUpperCase: function (value) {
    if (lodash.isString(value)) {
      return value.toUpperCase();
    } else {
      return value;
    }
  },
  uniq: function (value) {
    if (lodash.isArray(value)) {
      return lodash.uniq(value);
    } else {
      return value;
    }
  },
  words: function (value) {
    if (lodash.isString(value)) {
      return lodash.words(value);
    } else {
      return value;
    }
  }
};
