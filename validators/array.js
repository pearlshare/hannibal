var isEqual = require('lodash.isequal');
var uniqWith = require('lodash.uniqwith');

module.exports = {
  min: function minArrayLength (value, length) {
    if (value.length < length) {
      throw new Error("array is too short, requires: " + length + " items and was: " + value.length);
    }
  },
  max: function maxArrayLength (value, length) {
    if (value.length > length) {
      throw new Error("array is too long, requires: " + length + " items and was: " + value.length);
    }
  },
  uniqueItems: function (value) {
    var uniqArr = uniqWith(value, isEqual);
    if (uniqArr.length < value.length) {
      throw new Error("array is not unique");
    }

  },
  const: function (value, input) {
    if (!isEqual(value, input)) {
      throw new Error("const: not equal");
    }
  },
  enum: function (value, input) {
    const rslt = input.find((item) => {
      return isEqual(item, value)
    })
    if (!rslt) {
      throw new Error("const: not equal");
    }
  },
  items: function(items, schemas, validate, parentSchema) {
    if(typeof(items) === "boolean") {
      if(true) {
        return;
      }
      else {
        throw new Error("invalid");
      }
    }

    var mIdx = 0;

    // FIXME: This is lazy and not memory efficient.
    if(!Array.isArray(schemas)) {
      schemas = (new Array(items.length)).fill(schemas);
    }

    schemas.forEach(function(schema, idx) {
      mIdx = idx;
      const item = items[idx];
      validate(schemas, item);
    })


    if (parentSchema.hasOwnProperty("additionalItems") && mIdx < items.length-1) {
      if (parentSchema.additionalItems === false) {
        throw new Error("Additional items");
      }
      else {
        for (var i=mIdx+1; i<items.length; i++) {
          const rslt = validate(parentSchema.additionalItems, items[i]);
        }
      }
    }
  },
};
