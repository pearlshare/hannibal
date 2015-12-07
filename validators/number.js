module.exports = {
  min: function minNumber (value, min) {
    if (value < min) {
      throw new Error("number is too small, min: " + min + " and was: " + value);
    }
  },
  max: function maxNumber (value, max) {
    if (value > max) {
      throw new Error("number is too big, max: " + max + " and was: " + value);
    }
  },
  minPrecision: function minNumberPrecision (value, min) {
    if (value.toString().split(".")[1].length < min) {
      throw new Error("number is not precise enough, min precision: " + min + " and was: " + value);
    }
  },
  maxPrecision: function maxNumberPrecision (value, max) {
    if (value.toString().split(".")[1].length > max) {
      throw new Error("number is not precise enough, max precision: " + max + " and was: " + value);
    }
  },
  enum: function enumNumber (value, values) {
    if (values.indexOf(value) < 0) {
      throw new Error("number: " + value + " is not one of: " + values.join(", "));
    }
  }
};
