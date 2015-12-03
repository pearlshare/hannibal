var lodash = {
  uniq:    require("lodash.uniq"),
  isArray: require("lodash.isarray"),
  compact: require("lodash.compact")
};


module.exports = {
  uniq: function (value) {
    if (lodash.isArray(value)) {
      return lodash.uniq(value);
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
  }
}
