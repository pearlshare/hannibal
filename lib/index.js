var lodash = require("lodash");
var defaultValidators = require("./validators");
var defaultTransforms = require("./transforms");
var validate = require("./validate");

function Hannibal (opts) {
  var transforms = defaultTransforms;
  var validators = defaultValidators;

  if (opts) {
    if (opts.transforms) {
      transforms = lodash.assign({}, defaultTransforms, opts.transforms);
    }
    if (opts.validators) {
      validators = lodash.assign({}, defaultValidators, opts.validators);
    }
  }

  this.transforms = transforms;
  this.validators = validators;

  return this;
}

/**
 * fetch a validator function based on type and name
 * @param {String}  type    type of value to fetch validator for (string, number etc)
 * @param {String}  name    name of the validator function (min, max, enum etc)
 * @returns {Function} validator function taking params of the schema value and input value
 */
Hannibal.prototype.fetchValidator = function fetchValidator (type, name) {
  if (this.validators[type] && this.validators[type][name]) {
    return this.validators[type][name]; // look up built in validators
  } else {
    // TODO: Should we throw if not found or return empty function?
    //   * ensure mistakes aren't made specifying the schema
    //   * problem if multiple types are allowed but a validator doesn't exist for all types
    return function () {};
  }
};

/**
 * build a Hannibal validator
 * @param {Object} schema             the hannibal schema
 * @param {Object} opts               object hannibal options
 * @param {Object} opts.transforms    list of transofrms
 * @param {Object} opts.validators    list of validators
 * @returns {Function} validator
 */
Hannibal.prototype.create = function buildValidator (schema) {
  if (!lodash.isObject(schema)) {
    throw new Error("schema must be an object");
  }

  var self = this;

  /**
   * validator functional
   * @param {Object}   input   object to validate
   * @param {Object}   opts    object of items to pass to any transforms
   * @returns {Objct} validated object
   */
  return function validator (input, opts) {
    var validatorObj = {
      isValid: true,
      transforms: self.transforms,
      fetchValidator: self.fetchValidator.bind(self),
      opts: opts || {},
      originalData: lodash.clone(input)
    };

    var result = validate(schema, input, undefined, {}, validatorObj);

    if (!validatorObj.isValid) {
      validatorObj.error = result.error;
      return {
        isValid: false,
        originalData: validatorObj.originalData,
        data: result.data,
        error: result.error
      };
    } else {
      return {
        isValid: true,
        originalData: validatorObj.originalData,
        data: result.data,
        error: null
      };
    }
  };
};

module.exports = Hannibal;
