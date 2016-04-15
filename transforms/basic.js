var lodash = {
  isNumber: require("lodash.isnumber")
};

function notNullOrUndefined (value) {
  return value !== null && value !== undefined;
}


module.exports = {
  toString: function (value) {
    if (notNullOrUndefined(value)) {
      return String(value);
    } else {
      return value;
    }
  },
  toInteger: function (value) {
    if (notNullOrUndefined(value)) {
      var ret = parseInt(value, 10);
      if(Number.isNaN(ret)) {
        return value;
      }
      return ret;
    } else {
      return value;
    }
  },
  toFloat: function (value) {
    if (notNullOrUndefined(value)) {
      var ret = parseFloat(value);
      if(Number.isNaN(ret)) {
        return value;
      }
      return ret;
    } else {
      return value;
    }
  },
  toArray: function (value) {
    if (notNullOrUndefined(value)) {
      return [].concat(value);
    } else {
      return value;
    }
  },
  toDate: function (value) {
    if (notNullOrUndefined(value)) {
      var ret = new Date(value);
      if(Number.isNaN(ret.getTime())) {
        return value;
      }
      return ret;
    } else {
      return value;
    }
  },
  toBoolean: function (value) {
    if(lodash.isNumber(value) || (""+value).match(/^[0-9]+$/)) {
      return (value > 0);
    } else if (value === true || /^(true|on|yes)$/.test(value)) {
      return true;
    }  else if (value === false || /^(false|off|no)$/.test(value)) {
      return false;
    } else {
      return value;
    }
  }
};
