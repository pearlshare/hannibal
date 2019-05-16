module.exports = {
  const: function (value, input) {
    if (value !== null) {
      throw new Error("const: not equal");
    }
  },
  enum: function (value, input) {
    if (input.indexOf(null) < 0) {
      throw new Error("null: no null values in enum");
    }
  }
};

