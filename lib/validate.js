  var lodash = {
  isObject:  require("lodash.isobject"),
  keys:      require("lodash.keys"),
  forIn:     require("lodash.forin"),
  includes:  require("lodash.includes"),
  isNumber:  require("lodash.isnumber"),
  isString:  require("lodash.isstring"),
  isDate:    require("lodash.isdate"),
  isBoolean: require("lodash.isboolean"),
  isNull:    require("lodash.isnull")
};


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
  } else if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "function") {
    return "function";
  } else if (lodash.isObject(value)) {
    return "object";
  }
}

/**
 * tranform an object according to the list of transform functions
 * @param  {Array}  transforms    array of transform keys/functions to use
 * @param  {Object} value         value to perform transforms upon
 * @param  {Object} validatorObj  validator options object
 * @returns {Object}              return value
 */
function transform (transforms, value, validatorObj) {

  // Run any transform functions
  if (transforms) {
    [].concat(transforms).forEach(function (f) {
      if (typeof f === "string") {
        try {
          value = validatorObj.transforms[f](value, validatorObj.opts, validatorObj.originalData);
        } catch (e) {
          throw new Error("transforms '" + f + "' threw error: " + e);
        }
      } else if (typeof f === "function") {
        try {
          value = f(value, validatorObj.opts, validatorObj.originalData);
        } catch (e) {
          throw new Error("transforms '" + f + "' threw error: " + e);
        }
      }
    });
  }

  return value;
}

/**
 * validate the input object against the schema and build the output object
 * @param {Object}  testSchema     hannibal schema
 * @param {Object}  origValue      The object being validated
 * @param {Object}  output         The output object being built
 * @param {Object}  error          The error object being built
 * @param {Object}  validatorObj   The validation status object
 * @returns {Object} output object
 */
module.exports = function validate (testSchema, origValue, output, error, validatorObj) {

  // Find a named schema if given
  if (typeof testSchema.ref === "string") {
    var ref = testSchema.ref
    testSchema = validatorObj.namedSchemas[ref];

    if (typeof testSchema !== "object") {
      throw new Error("No named schema found using given ref " + ref)
    }
  }

  /*
    Step 1: Perform any transforms

    This step converts values which might change type such as turning a
    string "fish" via `toArray` into ["fish"]. This must be done before
    the recurse step as the value must be an array so that it can be recursed.
   */
  var value = transform(testSchema.transforms, origValue, validatorObj);

  /*
    Step 2: Recurse into any arrays/Objects

    Navigate into the object recursively. Only when the full object has
    been navigated/transformed from leaf level will the output start validating.
   */
  // Recurse into any arrays and build the validated output
  if (Array.isArray(value) && testSchema.schema) {
    var arrayResults = value.map(function(arrayValue) {
      return validate(
        testSchema.schema,
        arrayValue,
        output,
        {},
        validatorObj
      );
    });
    output = arrayResults.map(function (rslt) {
      return rslt.data;
    });
    var hasErrors = arrayResults.some(function (rslt) {
      return rslt.error;
    });
    if (hasErrors) {
      error = arrayResults.map(function (rslt) {
        return rslt.error;
      });
    }

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

  /*
    Step 3: Perform any reducers after validation

    A set of reducers is run. Reducers can be used to collapse any objects
    values or arrays which contain only invalid attributes.
   */
  output = transform(testSchema.reducers, output, validatorObj);

  /*
    Step 4: Validate the processed data

    Set any default values, test the value against the set of validation rules.
   */

  // Boolean whether this part of the schema is valid
  var isValid = true;

  // Set a default output if none
  if (testSchema.default !== undefined && (output === undefined || output === null)) {
    if (typeof testSchema.default === "function") {
      output = testSchema.default();
    } else {
      output = testSchema.default;
    }
  }

  // Check for presence if the output is required
  if (testSchema.required && output === undefined) {
    isValid = false;
    error.required = "key was not provided";
  }

  if (output !== undefined) {
    // Check the type
    var type = getType(output);
    var allowedTypes = [].concat(testSchema.type);
    if (testSchema.type && !lodash.includes(allowedTypes, type)) {
      isValid = false;
      error.type = "'" + type + "' was not in allowed types: " + allowedTypes.join(", ");
    }

    // Validate the output
    if (testSchema.validators) {
      if (!lodash.isObject(testSchema.validators)) {
        throw new Error("error parsing schema: validators is not an object");
      }
      lodash.forIn(testSchema.validators, function (validator, validatorName) {
        if (typeof validator === "function") {
          try {
            validator(output);
          } catch (e) {
            isValid = false;
            error[validatorName] = e.message;
          }
        } else {
          try {
            validatorObj.fetchValidator(type, validatorName)(output, validator);

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
