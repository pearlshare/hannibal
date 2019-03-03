var lodash = {
  isObject:  require("lodash.isobject"),
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
 * validate the input object against the schema and build the output object
 * @param {Object}  testSchema     hannibal schema
 * @param {Object}  value          The object being validated
 * @param {Object}  output         The output object being built
 * @param {Object}  error          The error object being built
 * @param {Object}  validatorObj   The validation status object
 * @returns {Object} output object
 */
module.exports = function validate (testSchema, value, output, error, validatorObj) {

  if (typeof (testSchema) === "boolean") {
    if (!testSchema) {
      throw new Error("Schema false");
    }
    else {
      return {
        data: value,
        error: null,
      }
    }
  }

  // Run any transform functions
  if (testSchema.transforms) {
    [].concat(testSchema.transforms).forEach(function (f) {
      if (typeof f === "string") {
        try {
          value = validatorObj.transforms[f](value, validatorObj.opts);
        } catch (e) {
          throw new Error("transforms '" + f + "' threw error: " + e);
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

  const schemaKey = validatorObj.jsonSchemaMode ? 'properties' : 'schema';

  // Recurse into any arrays and build the validated output
  if (Array.isArray(value) && testSchema[schemaKey]) {
    var arrayResults = value.map(function(arrayValue) {
      return validate(
        testSchema[schemaKey],
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
  } else if (lodash.isObject(value) && testSchema[schemaKey]) {
    output = {};
    Object.keys(testSchema[schemaKey]).forEach(function (key) {
      var rslt = validate(
        testSchema[schemaKey][key],
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
    if (testSchema.type && allowedTypes.indexOf(type) < 0) {
      isValid = false;
      error.type = "'" + type + "' was not in allowed types: " + allowedTypes.join(", ");
    }

    const validators = Object.assign({}, testSchema.validators);
    if (validatorObj.opts.jsonSchemaMode) {
      // Move keys out of validators sub object, for json-schema compatibility
      var validatorRemapDef = [
        {
          type: "array",
          to: "min",
          from: "minItems"
        },
        {
          type: "array",
          to: "max",
          from: "maxItems",
        },
        {
          type: "string",
          from: "enum",
          to: "enum",
        },
        {
          type: "number",
          from: "enum",
          to: "enum",
        },
        {
          type: "array",
          from: "enum",
          to: "enum",
        },
        {
          type: "null",
          from: "enum",
          to: "enum",
        },
        {
          type: "object",
          from: "enum",
          to: "enum",
        },
        {
          type: "object",
          from: "properties",
          to: "schema",
        },
        {
          type: "object",
          from: "required",
          to: "required",
        },
        {
          type: "object",
          from: "patternProperties",
          to: "patternProperties",
        },
        {
          type: "object",
          from: "propertyNames",
          to: "propertyNames",
        },
        {
          type: "array",
          from: "items",
          to: "items",
        },
        {
          type: "string",
          to: "min",
          from: "minLength",
        },
        {
          type: "string",
          to: "max",
          from: "maxLength",
        },
        {
          type: "number",
          to: "max",
          from: "maximum",
        },
        {
          type: "number",
          to: "min",
          from: "minimum",
        },
        {
          type: "string",
          to: "regex",
          from: "pattern",
        },
        {
          type: "number",
          to: "exclusiveMinimum",
          from: "exclusiveMinimum",
        },
        {
          type: "number",
          from: "exclusiveMaximum",
          to: "exclusiveMaximum",
        },
        {
          type: "array",
          from: "uniqueItems",
          to: "uniqueItems",
        },
        {
          type: "object",
          to: "maxProperties",
          from: "maxProperties"
        },
        {
          type: "object",
          to: "minProperties",
          from: "minProperties"
        },
        {
          type: "number",
          to: "const",
          from: "const"
        },
        {
          type: "date",
          to: "const",
          from: "const"
        },
        {
          type: "string",
          to: "const",
          from: "const"
        },
        {
          type: "object",
          to: "const",
          from: "const"
        },
        {
          type: "array",
          to: "const",
          from: "const"
        },
        {
          type: "null",
          to: "const",
          from: "const"
        },
      ];
        
      validatorRemapDef.forEach(function(obj) {
        if (obj.type === type) {
          var to = obj.to;
          var from = obj.from;

          if(testSchema.hasOwnProperty(from)) {
            validators[to] = testSchema[from];
          }
          else if (validators.hasOwnProperty(to)) {
            validators[to] = testSchema[to];
          }
        }
      })
    }

    // Validate the output
    if (validators) {
      if (!lodash.isObject(validators)) {
        throw new Error("error parsing schema: validators is not an object");
      }
      Object.keys(validators).forEach(function(validatorName) {
        var validator = validators[validatorName];
        if (typeof validator === "function") {
          try {
            validator(output);
          } catch (e) {
            isValid = false;
            error[validatorName] = e.message;
          }
        } else {
          try {
            validatorObj.fetchValidator(type, validatorName)(output, validator, function(schema, input) {
              return validate(schema, input, undefined, error, validatorObj)
            }, testSchema);

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
