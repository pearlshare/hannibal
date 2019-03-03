module.exports = {
  const: function (value, input) {
    if (value !== null) {
      throw new Error("const: not equal");
    }
  }
};

