var lodash = {
  assign:   require("lodash.assign"),
  isObject: require("lodash.isobject"),
  clone:    require("lodash.clone"),
  keys:     require("lodash.keys")
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
 * @param {Object} validators    validators to add nested by a type key (such as `string`)
 * @property {Object} validators.Array
 * @property {Object} validators.Date
 * @property {Object} validators.Function
 * @property {Object} validators.Null
 * @property {Object} validators.Number
 * @property {Object} validators.Object
 * @property {Object} validators.String
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
 * Register a set of transform functions
 * @param {Object} transforms       object containing transforms to add
 * @returns {Object} entire transforms object
 */
Hannibal.prototype.addTransforms = function addTransforms (transforms) {
  this.transforms = lodash.assign(this.transforms, transforms);
};

/**
 * Register a set of reducer functions
 * @param {Object} reducers         object containing reducers to add
 * @returns {Object} entire reducers object
 */
Hannibal.prototype.addReducers = function addReducers (reducers) {
  this.reducers = lodash.assign(this.reducers, reducers);
};

/**
 * Crawl a hannibal schema and collect all the named schemas
 * @param {Object} schema schema to crawl for named schemas
 * @param {Object} found list of found schemas
 * @returns {Object} object with keys of schema ids and values of the schemas
 */
Hannibal.prototype.findNamedSchemas = function findNamedSchemas (schema, found) {
  found = found || {};
  var self = this;

  if (schema.id) {
    if (found[schema.id]) throw new Error("Schema id already defined: " + schema.id);

    found[schema.id] = schema;
  }

  if (schema.type === "array") {
    if (schema.schema) {
      self.findNamedSchemas(schema.schema, found);
    }

  } else if (schema.type === "object") {
    if (schema.schema) {
      Object.keys(schema.schema).forEach(function (key) {
        self.findNamedSchemas(schema.schema[key], found);
      });
    }
  }

  return found;
}

/**
 * build a Hannibal validator
 * @param {Object} schema             the hannibal schema
 * @param {Object} opts               object hannibal options
 * @property {Object} opts.transforms    list of transforms
 * @property {Object} opts.validators    list of validators
 * @returns {Function} validator
 */
Hannibal.prototype.create = function buildValidator (schema) {
  if (!lodash.isObject(schema)) {
    throw new Error("schema must be an object");
  }

  var namedSchemas = this.findNamedSchemas(schema);

  var self = this;

  /**
   * validator function
   * @param {Object}   input   object to validate
   * @param {Object}   opts    any options the user wants to pass to transforms
   * @returns {Objct} validated object
   */
  function validator (input, opts) {
    var validatorObj = {
      isValid: true,
      transforms: self.transforms,
      fetchValidator: self.fetchValidator.bind(self),
      opts: opts || {},
      originalData: lodash.clone(input),
      namedSchemas: namedSchemas
    };

    var result = validate(schema, input, undefined, {}, validatorObj);

    return {
      isValid: validatorObj.isValid,
      originalData: validatorObj.originalData,
      data: result.data,
      error: result.error
    };
  };

  validator.schema = schema;
  validator.namedSchemas = namedSchemas;

  return validator;
};

module.exports = Hannibal;
