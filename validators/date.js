module.exports = {
  min: function minDate (value, min) {
    if (value < min) {
      throw new Error("date is early, min: " + min + " and was: " + value);
    }
  },
  max: function maxDate (value, max) {
    if (value > max) {
      throw new Error("date is too late, max: " + max + " and was: " + value);
    }
  }
};
