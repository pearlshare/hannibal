var lodash = require("lodash");
var validators = require("./validators");
var pre = require("./pre");

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
 * fetch a validator function based on type and name
 * @param {String}  type    type of value to fetch validator for (string, number etc)
 * @param {String}  name    name of the validator function (min, max, enum etc)
 * @returns {Function} validator function taking params of the schema value and input value
 */
function fetchValidator (type, name) {
  if (validators[type] && validators[type][name] && typeof validators[type][name] === "function") {
    return validators[type][name]; // look up built in validators
  } else {
    throw new Error("No validator found called '" + name + "' for type " + type);
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
function validate (testSchema, value, output, error, validatorObj) {

  // Run any pre functions
  if (testSchema.pre) {
    [].concat(testSchema.pre).forEach(function (f) {
      if (typeof f === "string") {
        value = pre[f](value);
      } else if (typeof f === "function") {
        value = f(value);
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

  if (testSchema.required && output === undefined) {
    isValid = false;
    error.required = "was not provided";
  }

  if (output !== undefined) {
    // Check the type
    var type = getType(value);
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
        if (validatorName === "custom" && typeof validator === "function") {
          try {
            validator(value);
          } catch (e) {
            isValid = false;
            error[validatorName] = e.message;
          }
        } else {
          try {
            fetchValidator(type, validatorName)(validator, value);

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

}

/**
 * build a Hannibal validator
 * @param {Object} schema   object containing the hannibal schema
 * @returns {Function} validator
 */
function buildValidator (schema) {
  if (!lodash.isObject(schema)) {
    throw new Error("schema must be an object");
  }

  return function validator (input) {
    var validatorObj = {
      isValid: true,
      // original data fed into validator
      originalData: lodash.clone(input)
    };

    var result = validate(schema, input, {}, {}, validatorObj);

    validatorObj.data = result.data;

    if (!validatorObj.isValid) {
      validatorObj.error = result.error;
    }

    return validatorObj;
  };
}

module.exports = buildValidator;
