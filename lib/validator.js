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

  // Recurse into any objects and arrays
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
  } else if (lodash.isObject(value) && testSchema.schema) {
    lodash.keys(testSchema.schema).forEach(function (key) {
      output[key] = {};
      error[key] = {};
      var rslt = validate(
        testSchema.schema[key],
        value[key],
        output[key],
        error[key],
        validatorObj
      );
      output[key] = rslt.data;
      error[key] = rslt.error;
      if (rslt.isValid && lodash.keys(error[key]).length === 0) {
        delete error[key];
      }
    });
  } else {
    output = value;
  }

  // Boolean whether this part of the schema is valid
  var isValid = true;

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

  if (!isValid) {
    validatorObj.isValid = false;
  }

  return {
    data: output,
    error: error,
    isValid: isValid
  };

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
