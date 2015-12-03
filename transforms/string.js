var lodash = {
  capitalize: require("lodash.capitalize"),
  isString:   require("lodash.isstring"),
  deburr:     require("lodash.deburr"),
  escape:     require("lodash.escape"),
  kebabCase:  require("lodash.kebabcase"),
  trim:       require("lodash.trim"),
  words:      require("lodash.words")
};


module.exports = {
  capitalize: function (value) {
    if (lodash.isString(value)) {
      return lodash.capitalize(value);
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
  words: function (value) {
    if (lodash.isString(value)) {
      return lodash.words(value);
    } else {
      return value;
    }
  }
}
