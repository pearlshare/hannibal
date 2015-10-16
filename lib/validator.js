var lodash = require("lodash");
var validators = require("./validators");

/*
# Approach

1. Generate an output object
2. For each object (single or array) test it against matched part of schema
3.

*/

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


function runValidator (validator, value) {
  if (lodash.isString(validator)) {
    // look up built in validators
  } else if (lodash.isFunction(validator)) {
    // run the custom validator
  }
}

/**
 * validate the input object against the schema and build the output object
 * @param {Object}  testSchema     hannibal schema
 * @param {Object}  input          The object being validated
 * @returns {Object} output object
 */
function validate (testSchema, value, output, validatorObj) {

  if (lodash.isArray(value) && testSchema.schema) {
    output = lodash.map(value, function(arrayValue) {
      return validate(
        testSchema.schema,
        arrayValue,
        output,
        validatorObj
      );
    });
  } else if (lodash.isObject(value) && testSchema.schema) {
    lodash.keys(testSchema.schema).forEach(function (key) {
      output[key] = {};
      output[key] = validate(
        testSchema.schema[key],
        value[key],
        output[key],
        validatorObj
      )
    });
  }

  // console.log('value', value);
  // console.log('testSchema.schema', testSchema.schema);


  // Boolean whether this part of the schema is valid
  var isValid = true;
  // List of errors or this part of the schema
  var error = {};

  // Run any pre functions
  if (testSchema.pre) {
    [].concat(testSchema.pre).forEach(function (f) {
      value = f(obj, key, value)
    });
  }

  // Check the type
  var type = getType(value);
  var allowedTypes = [].concat(testSchema.type);
  if (testSchema.type && !lodash.include(allowedTypes, type)) {
    isValid = false;
    error.type = "'"+ type + "' was not in allowed types: " + allowedTypes.join(", ");
  }

  // Validate the value
  if (testSchema.validators) {
    if (!lodash.isObject(testSchema.validators)) {
      throw new Error("error parsing schema: validators is not an object: " + key);
    }
    for (var validatorKey of testSchema.validators) {
      var validators = [].concat(testSchema.validators[validatorKey]);
      validators.forEach(function (validator) {
        try {
          runValidator(validator, value);

        } catch (e) {
          isValid = false;
          error[validatorKey] = e.message;
        }
      });
    }
  }

  if (!isValid) {
    validatorObj.error = error;
    validatorObj.isValid = false;
  }

  return value;

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
      originalData: lodash.clone(input),
      // data is the valid data
      data: null,
      // Error is a nested object of errors
      error: {}
    };

    validatorObj.data = validate(schema, input, {}, validatorObj);

    return validatorObj;
  };
}

module.exports = buildValidator;
