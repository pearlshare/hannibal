var object = require("./object");

module.exports = {
  allOf: object.allOf,
  anyOf: object.anyOf,
  oneOf: object.oneOf,
  not: object.not,
  const: function (value, input) {
    if (value !== input) {
      throw new Error("const: not equal");
    }
  }
};
