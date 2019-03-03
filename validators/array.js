var lodash = {
  isEqual: require('lodash.isequal'),
  uniqWith: require('lodash.uniqwith')
};

module.exports = {
  min: function minArrayLength (value, length) {
    if (value.length < length) {
      throw new Error("array is too short, requires: " + length + " items and was: " + value.length);
    }
  },
  max: function maxArrayLength (value, length) {
    if (value.length > length) {
      throw new Error("array is too long, requires: " + length + " items and was: " + value.length);
    }
  },
  uniqueItems: function (value) {
    var uniqArr = lodash.uniqWith(value, lodash.isEqual);
    if (uniqArr.length < value.length) {
      throw new Error("array is not unique");
    }

  }
};
