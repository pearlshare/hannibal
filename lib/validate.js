var lodash = require("lodash");

/*
 * get the type of the value
 * @param {Thing}  value    the value to get the type from
 * @returns {String} the Hannibal schema type
 */
function getType (value) {
  if (lodash.isNumber(value)) {
    return "number";
  } else if (lodash.isString(value)) {
    return "string";
  } else if (lodash.isDate(value)) {
    return "date";
  } else if (lodash.isBoolean(value)) {
    return "boolean";
  } else if (lodash.isNull(value)) {
    return "null";
  } else if (lodash.isArray(value)) {
    return "array";
  } else if (lodash.isObject(value)) {
    return "object";
  }
}

/**
 * validate the input object against the schema and build the output object
 * @param {Object}  testSchema     hannibal schema
 * @param {Object}  value          The object being validated
 * @param {Object}  output         The output object being built
 * @param {Object}  error          The error object being built
 * @param {Object}  validatorObj   The validation status object
 * @returns {Object} output object
 */
module.exports = function validate (testSchema, value, output, error, validatorObj) {

  // Run any transform functions
  if (testSchema.transforms) {
    [].concat(testSchema.transforms).forEach(function (f) {
      if (typeof f === "string") {
        try {
          value = validatorObj.transforms[f](value, validatorObj.opts);
        } catch (e) {
          throw new Error("no transforms registered called: " + f);
        }
      } else if (typeof f === "function") {
        try {
          value = f(value, validatorObj.opts);
        } catch (e) {
          throw new Error("transforms '" + f + "' threw error: " + e);
        }
      }
    });
  }

  // Recurse into any arrays and build the validated output
  if (lodash.isArray(value) && testSchema.schema) {
    var arrayResults = lodash.map(value, function(arrayValue) {
      return validate(
        testSchema.schema,
        arrayValue,
        output,
        error,
        validatorObj
      );
    });
    output = lodash.map(arrayResults, function (rslt) {
      return rslt.data;
    });
    error = lodash.map(arrayResults, function (rslt) {
      return rslt.error;
    });

  // Recurse into any objects and build the validated output
  } else if (lodash.isObject(value) && testSchema.schema) {
    output = {};
    lodash.keys(testSchema.schema).forEach(function (key) {
      var rslt = validate(
        testSchema.schema[key],
        value[key],
        {},
        {},
        validatorObj
      );

      if (rslt.data !== undefined) {
        output[key] = rslt.data;
      }
      if (rslt.error !== undefined) {
        error[key] = rslt.error;
      }
    });
  } else {
    output = value;
  }

  // Boolean whether this part of the schema is valid
  var isValid = true;

  // Set a default value if none
  if (testSchema.default !== undefined && value === undefined) {
    if (typeof testSchema.default === "function") {
      output = testSchema.default();
    } else {
      output = testSchema.default;
    }
  }

  // Check for presence if the value is required
  if (testSchema.required && output === undefined) {
    isValid = false;
    error.required = "key was not provided";
  }

  if (output !== undefined) {
    // Check the type
    var type = getType(output);
    var allowedTypes = [].concat(testSchema.type);
    if (testSchema.type && !lodash.include(allowedTypes, type)) {
      isValid = false;
      error.type = "'" + type + "' was not in allowed types: " + allowedTypes.join(", ");
    }

    // Validate the value
    if (testSchema.validators) {
      if (!lodash.isObject(testSchema.validators)) {
        throw new Error("error parsing schema: validators is not an object");
      }
      lodash.forIn(testSchema.validators, function (validator, validatorName) {
        if (typeof validator === "function") {
          try {
            validator(value);
          } catch (e) {
            isValid = false;
            error[validatorName] = e.message;
          }
        } else {
          try {
            validatorObj.fetchValidator(type, validatorName)(value, validator);

          } catch (e) {
            isValid = false;
            error[validatorName] = e.message;
          }
        }
      });
    }

  }

  // If valid return data and any error objects (which may be deep nested)
  if (isValid) {
    return {
      data: output,
      error: Object.keys(error).length > 0 ? error : undefined,
      isValid: true
    };
  // If invalid return error
  } else {
    validatorObj.isValid = false;
    return {
      error: error,
      isValid: false
    };
  }

};
