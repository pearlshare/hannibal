exports.string = {
  min: function minStringLength (value, length) {
    if (value.length < length) {
      throw new Error("string is too short, requires: " + length + " chars and was: " + value.length);
    }
  },
  max: function maxStringLength (value, length) {
    if (value.length > length) {
      throw new Error("string is too long, requires: " + length + " chars and was: " + value.length);
    }
  },
  regex: function regexString (value, regex) {
    var regexp = new RegExp(regex);
    if (!regexp.exec(value)) {
      throw new Error("string does not match regex");
    }
  },
  enum: function enumString (value, values) {
    if (values.indexOf(value) < 0) {
      throw new Error("string: " + value + " is not one of: " + values.join(", "));
    }
  }
};

exports.number = {
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
    if (value.toString().split(".").length <= min) {
      throw new Error("number is not precise enough, min precision: " + min + " and was: " + value);
    }
  },
  maxPrecision: function maxNumberPrecision (value, max) {
    if (value.toString().split(".").length >= max) {
      throw new Error("number is not precise enough, max precision: " + max + " and was: " + value);
    }
  },
  enum: function enumNumber (value, values) {
    if (values.indexOf(value) < 0) {
      throw new Error("number: " + value + " is not one of: " + values.join(", "));
    }
  }
};

exports.array = {
  min: function minArrayLength (value, length) {
    if (value.length < length) {
      throw new Error("array is too short, requires: " + length + " items and was: " + value.length);
    }
  },
  max: function maxArrayLength (value, length) {
    if (value.length > length) {
      throw new Error("array is too long, requires: " + length + " items and was: " + value.length);
    }
  }
};

exports.date = {
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

