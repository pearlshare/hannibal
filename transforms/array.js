var lodash = {
  uniq:    require("lodash.uniq"),
  compact: require("lodash.compact")
};


module.exports = {
  uniq: function (value) {
    if (Array.isArray(value)) {
      return lodash.uniq(value);
    } else {
      return value;
    }
  },
  compact: function (value) {
    if (Array.isArray(value)) {
      return lodash.compact(value);
    } else {
      return value;
    }
  }
};
