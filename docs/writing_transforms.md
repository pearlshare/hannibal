# Writing transforms

Transforms are functions intended to coerce a value into a format ready for validation.

As the transform function is designed to coerce a value it must handle any type of value without erroring such as `string`, `array` or `object`.

When Hannibal validates an object it walks the object tree so every part of the object is coerced and validated. Transforms are performed before walking to a deeper level. For example the transform `toString` will convert `1` to `"1"` before the string validation checks are performed.

The run order for each level of an object is:

1. Perform the transform on the value
2. Recurse into the object
3. Perform any reducers
4. Validate the object

When writing transforms it is recommended to make them idempotent.  This is that they can be run multiple times on an object and have the same output.  For example `toString` will convert `1` into `"1"` and if run again the output will remain `"1"`.

## Simple transforms

A simple tranform is a function which takes the input value and returns the coerced output value.

Usage:

```js
var Hannibal = require("hannibal");
var Hannibal = new Hannibal({
    transforms: {
        string: {
            toLowerCase: function (value) {
                return String(value).toLowerCase();
            }
        }
    }
});
var validator = Hannibal.create({
    type: "string",
    transforms: "toLowerCase"
});

// Define validator with second argument to pass to all transforms
var rslt = validator("Face")
assert.equal(rslt.isValid, true);
assert.equal(rslt.data, "face");
```

## Advanced transforms

The transform function is called with three arguments.

```js
function myTransform (value, opts, originalData) {}
```

The second argument `opts` will contain anything given to the validators.

Usage:

```js
var Hannibal = require("hannibal");
var proHannibal = new Hannibal({
    transforms: {
        multiply: function (value, opts) {
            return parseFloat(value) * opts.multiplier
        }
    }
});
var proValidator = proHannibal.create({
    type: "number",
    transforms: "multiply"
});

// Call the validator with a second argument. This value is passed to all transforms
var proRslt = proValidator(2, {multiplier: 5})
assert.equal(proRslt.isValid, true);
assert.equal(proRslt.data, 10);
```

The third argument `originalData` will include the whole object passed into the validator.

Usage:

```js
var Hannibal = require("hannibal");
var proHannibal = new Hannibal({
    transforms: {
        addSalutation: function (value, opts, originalObject) {
            if (originalObject.gender === "male") {
                return "Mr " + value;
            } else if (originalData.gender === "female") {
                return "Ms " + value;
            } else {
                return value;
            }
        }
    }
});
var proValidator = proHannibal.create({
    type: "object",
    schema: {
        gender: {
            type: "string",
            validators: {
                enum: ["male", "female"]
            }
        },
        name: {
            type: "string",
            transforms: "addSalutation"
        }
    }
});
// Define validator with second argument to pass to all transforms
var proRslt = proValidator({
    name: "Hannibal",
    gender: "male"
})
assert.equal(proRslt.isValid, true);
assert.equal(proRslt.data.name, "Mr Hannibal");
```
