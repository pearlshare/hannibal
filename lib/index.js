var lodash = {
  assign: require("lodash.assign"),
  isObject: require("lodash.isobject"),
  clone: require("lodash.clone"),
  keys: require("lodash.keys")
};
var validate = require("./validate");

function Hannibal (opts) {
  // Object.create so it has no toString method.
  this.transforms = Object.create(null);
  this.validators = Object.create(null);

  if (opts) {
    if (opts.transforms) {
      this.addTransforms(opts.transforms);
    }
    if (opts.validators) {
      this.addValidators(opts.validators);
    }
  }

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
 * set a validator function based on type
 * @param {Object}  validators  validators to add
 * @returns {Object} entire validators object
 */
Hannibal.prototype.addValidators = function addValidators (validators) {
  var self = this;
  lodash.keys(validators).forEach(function (type) {
    if (!self.validators[type]) {
      self.validators[type] = {};
    }
    self.validators[type] = lodash.assign(self.validators[type], validators[type]);
  });
};

/**
 * set a validator function based on type
 * @param {Object}  transforms  transforms to add
 * @returns {Object} entire transforms object
 */
Hannibal.prototype.addTransforms = function addTransforms (transforms) {
  this.transforms = lodash.assign(this.transforms, transforms);
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
