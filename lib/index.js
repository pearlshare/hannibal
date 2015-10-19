var lodash = require("lodash");
var defaultValidators = require("./validators");
var defaultPre = require("./pre");
var validate = require("./validate");

function Hannibal (opts) {
  var pre = defaultPre;
  var validators = defaultValidators;

  if (opts) {
    if (opts.pre) {
      pre = lodash.assign({}, defaultPre, opts.pre);
    }
    if (opts.validators) {
      validators = lodash.assign({}, defaultValidators, opts.validators);
    }
  }

  this.pre = pre;
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
 * @param {Object} opts.pre           list of pre functions
 * @param {Object} opts.validators    list of validators functions
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
   * @param {Object}   opts    object of items to pass to any pre transformers
   * @returns {Objct} validated object
   */
  return function validator (input, opts) {
    var validatorObj = {
      isValid: true,
      pre: self.pre,
      fetchValidator: self.fetchValidator.bind(self),
      opts: opts || {},
      originalData: lodash.clone(input)
    };

    var result = validate(schema, input, undefined, {}, validatorObj);

    validatorObj.data = result.data;

    if (!validatorObj.isValid) {
      validatorObj.error = result.error;
    }

    return validatorObj;
  };
};

module.exports = Hannibal;
