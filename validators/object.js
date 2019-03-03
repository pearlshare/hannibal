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
  propertyNames: function (value, schema, validate) {
    Object.keys(value).forEach(function(key) {
      validate(schema, key);
    })
  },
  patternProperties: function (value, obj, validate) {
    const keyFns = Object.keys(obj).map(function(key) {
      return {
        regex: new RegExp(key),
        schema: obj[key]
      }
    });

    Object.keys(value).forEach(function(key) {
      const found = keyFns.find(function (obj) {
        return key.match(obj.regex)
      });

      if(!found) {
        throw new Error("no found '"+key+"'");
      }

      validate(found.schema, value[key]);
    })
  },
  contains: function (value, schema) {
    // TODO
  },
  const: function (value, input) {
    if (!isEqual(value, input)) {
      throw new Error("const: not equal");
    }
  },
  enum: function (value, input) {
    const rslt = input.find((item) => {
      return isEqual(item, value)
    })
    if (!rslt) {
      throw new Error("const: not equal");
    }
  },
  required: function (value, input) {
    const keys = Object.keys(value)
    const rslt = input.forEach(function (key) {
      if(keys.indexOf(key) < 0) {
        throw new Error("Required field '"+key+"' not found");
      }
    })
  },
  dependencies: function (value, input, validate) {
    Object.keys(input).forEach(function (key) {
      if (value[key]) {
        if (Array.isArray(input[key])) {
          input[key].forEach(function(depKey) {
            if (!value.hasOwnProperty(depKey)) {
              throw new Error("Missing dependency: '"+depKey+"'");
            }
          })
        }
        else if(typeof(input[key]) === "object") {
          validate(input[key], value);
        }
        else {
          throw new Error("Unexpected");
        }
      }
    })
  }
};
