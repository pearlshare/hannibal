exports.string = {
  min: function minStringLength (length, value) {
    if (value.length < length) {
      throw new Error("string is too short, requires: " + length + " chars and was: " + value.length);
    }
  },
  max: function maxStringLength (length, value) {
    if (value.length > length) {
      throw new Error("string is too long, requires: " + length + " chars and was: " + value.length);
    }
  },
  regex: function regexString (regex, value) {
    var regexp = new RegExp(regex);
    if (!regexp.exec(value)) {
      throw new Error("string does not match regex");
    }
  },
  enum: function enumString (values, value) {
    if (values.indexOf(value) < 0) {
      throw new Error("string: " + value + " is not one of: " + values.join(", "));
    }
  }
};

exports.number = {
  min: function minNumber (min, value) {
    if (value < min) {
      throw new Error("number is too small, min: " + min + " and was: " + value);
    }
  },
  max: function maxNumber (max, value) {
    if (value > max) {
      throw new Error("number is too big, max: " + max + " and was: " + value);
    }
  },
  minPrecision: function minNumberPrecision (min, value) {
    if (value.toString().split(".").length <= min) {
      throw new Error("number is not precise enough, min precision: " + min + " and was: " + value);
    }
  },
  maxPrecision: function maxNumberPrecision (max, value) {
    if (value.toString().split(".").length >= max) {
      throw new Error("number is not precise enough, max precision: " + max + " and was: " + value);
    }
  },
  enum: function enumNumber (values, value) {
    if (values.indexOf(value) < 0) {
      throw new Error("number: " + value + " is not one of: " + values.join(", "));
    }
  }
};

exports.array = {
  min: function minArrayLength (length, value) {
    if (value.length < length) {
      throw new Error("array is too short, requires: " + length + " items and was: " + value.length);
    }
  },
  max: function maxArrayLength (length, value) {
    if (value.length > length) {
      throw new Error("array is too long, requires: " + length + " items and was: " + value.length);
    }
  }
};

exports.date = {
  min: function minDate (min, value) {
    console.log('min', min);
    console.log('value', value);
    if (value < min) {
      throw new Error("date is early, min: " + min + " and was: " + value);
    }
  },
  max: function maxDate (max, value) {
    if (value > max) {
      throw new Error("date is too late, max: " + max + " and was: " + value);
    }
  }
};

