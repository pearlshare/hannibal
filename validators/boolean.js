module.exports = {
  const: function (value, input) {
    if (value !== input) {
      throw new Error("const: not equal");
    }
  }
};
