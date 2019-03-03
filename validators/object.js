const isEqual = require("lodash.isequal");

module.exports = {
  maxProperties: function minDate (value, maxProperties) {
    const numKeys = Object.keys(value).length;
    if (numKeys > maxProperties) {
      throw new Error("maxProperties: " + maxProperties);
    }
  },
  minProperties: function minDate (value, minProperties) {
    const numKeys = Object.keys(value).length;
    if (numKeys < minProperties) {
      throw new Error("maxProperties: " + minProperties);
    }
  },
  propertyNames: function (value, schema) {
    // TODO
  },
  patternProperties: function (value, obj) {
    // TODO
  },
  contains: function (value, schema) {
    // TODO
  },
  const: function (value, input) {
    if (!isEqual(value, input)) {
      throw new Error("const: not equal");
    }
  }
};
