const isEqual = require("lodash.isequal");

module.exports = {
  allOf: function(value, schemas, validate) {
    if(schemas.length < 1) {
      throw new Error("allOf: Must be a non empty array");
    }

    var fail = false;
    schemas.forEach(function(schema) {
      const rslt = validate(schema, value, {clean: true});
      if (!rslt.isValid) {
        fail = true;
      }
    })


    if (fail) {
      throw new Error("Must match all");
    }
  },
  anyOf: function(value, schemas, validate) {
    if(schemas.length < 1) {
      throw new Error("allOf: Must be a non empty array");
    }

    const found = schemas.filter(function(schema) {
      const rslt = validate(schema, value, {clean: true});
      return rslt.isValid;
    })

    if (found.length < 1) {
      throw new Error("anyOf failed");
    }
  },
  not: function(value, schema, validate) {
    const rslt = validate(schema, value, {clean: true});
    if(rslt.isValid) {
      throw new Error(rslt.error);
    }
  },
  oneOf: function(value, schemas, validate) {
    if(schemas.length < 1) {
      throw new Error("oneOf: Must be a non empty array");
    }

    let found = false;
    schemas.forEach(function(schema) {
      const rslt = validate(schema, value, {clean: true});
      if(found && rslt.isValid) {
        throw new Error("found more than one");
      }
      else if (rslt.isValid) {
        found = true;
      }
    })
  },
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
    const keys = Object.keys(value)
    if(schema === false) {
      if (keys.length > 0) {
        throw new Error("No propertyNames allowed");
      }
    }
    else {
      keys.forEach(function(key) {
        validate(schema, key);
      })
    }
  },
  patternProperties: function (value, obj, validate, parent) {
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

      if (found) {
        validate(found.schema, value[key]);
      }
    })
  },
  additionalProperties: function(value, schema) {
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
  required: function (value, input, validate, parent) {
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
        else if(
          ["object", "boolean"].indexOf(
            typeof(input[key])
          ) > -1
        ) {
          const rslt = validate(input[key], value);
          if(!rslt.isValid) {
            throw new Error("TODO");
          }
        }
        else {
          throw new Error("Unexpected");
        }
      }
    })
  }
};
