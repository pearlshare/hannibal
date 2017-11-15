# Hannibal

![circleci](https://circleci.com/gh/pearlshare/hannibal.png?style=shield)
![Dependency Status](https://david-dm.org/pearlshare/hannibal.svg)
![Dev Dependency Status](https://david-dm.org/pearlshare/hannibal/dev-status.svg)

![love it when a plan comes together](https://images.rapgenius.com/530583e79e4fc7f75855995d511e185c.400x294x1.jpg)

## What's it for?

Coerce and validate objects against a set of rules (schema or plan). This is useful for defining APIs and model interfaces.

Use cases:

* Coerce API input (string to number etc) and validate it. Return errors in a consistent format.
* Build client side forms from schemas, handle validation client side knowing the API is using the exact same validation rules.
* Create ORMs ensuring that data is in the right format and valid before being entered in the database.

## Objectives

Coerce and validate an object in one pass.

Provide clear error reporting which is easy to consume.

Objects definitions are extensible and composable.

Provide a handy set of common validations such as min/max values, regex and enums to get going quickly but without going overboard.

Schemas should be plain JSON objects for easy composition and re-use.

## Why not use SchemaJS?

If you only need object validation then SchemaJS is probably the solution for you. It's a standard and there are many highly performance optimised solutions out there.

Hannibal was designed for object management.  It not only validates but can also coerce data types and modify object structures whilst only walking an object tree once.

## Basic usage

Create a validator to check a user object is valid.

```js
// Load Hannibal
var Hannibal = require("hannibal");

// Create a Hannibal instance
var hannibal = new Hannibal();

// Create a validator by adding a schema
var basicValidator = hannibal.create({
    type: "object",
    schema: {
        name: {
            type: "string"
        },
        age: {
            type: "number"
        },
        address: {
            type: "object",
            schema: {
                street: {
                    type: "string"
                },
                city: {
                    type: "string"
                }
            }
        }
    }
});

// Check a valid user
var basicRslt1 = basicValidator({
    name: "John Smith",
    age: 53,
    address: {
        street: "The underground",
        city: "Los Angeles"
    }
})
assert(basicRslt1.isValid);
assert.deepEqual(basicRslt1.data, {
    name: "John Smith",
    age: 53,
    address: {
        street: "The underground",
        city: "Los Angeles"
    }
});

// Check an invalid user
var basicRslt2 = basicValidator({
    name: "Templeton Peck",
    age: "foo",
    address: {
        city: "Los Angeles"
    }
});

assert(!basicRslt2.isValid);
assert.deepEqual(basicRslt2.error, {
    age: {
        type: '\'string\' was not in allowed types: number'
    }
});
assert.deepEqual(basicRslt2.data, {
    name: 'Templeton Peck',
    address: { city: 'Los Angeles' }
});
```


## Schema

The schema is a JS or JSON object which defines the validation rules. It can contain nested schemas to perform deep validation into objects.

The default schema looks like this:

```js
var schema = {
    type: "object",
    required: true,
    schema: {
        oneKey: {
            type: "string"
        }
    }
}
```

### schema.type

The type key of the schema represent the type of primitive allowed as a value. These are provided as either a string or array of strings.

Available types:

 * string
 * date
 * boolean
 * time
 * number
 * array
 * object
 * null

Usage:

```js
// valid if value is a string
var schema = {
    type: "string"
}

// valid if value is either a string or null
var schema2 = {
    type: ["string", "null"]
}
```

### schema.required

The `required` key of the schema means a value is required to be valid. A value can be anything including null, undefined and 0. Note that `required` does not check the value type, purely the presence of a value.

Usage:

```js
var schema = {
    type: "string",
    required: true
}
```

### schema.default

The `default` key of the schema will set a value in the object being validated if the key is missing or the value is `undefined`. The value of the `default` key can be the default value itself or a function returning a value.

Usage:

```js
var schema = {
    type: "boolean",
    default: false
}

var schema2 = {
    type: "date",
    default: function () {
        return new Date();
    }
}
```

### schema.id

The `id` key of the schema will allow the schema to be referenced elsewhere in the schema using the `ref` key. This is useful for recursive schemas or schema re-use.

Usage:

```js
var schema = {
    type: "object",
    id: "contact",
    schema: {
        name: {
            type: "string"
        },
        phone: {
            type: "string"
        },
        contacts: {
            type: "array",
            schema: {
                ref: "contact"
            }
        }
    }
}
```

### schema.transforms

The `transforms` key of the schema provides a set of transform functions to run on the object being validated. These are provided as a single or array of strings or functions. A transform can convert a coerce or cast a value into a type. For example turning `"false"` into `false` or `"string"` into `["string"]`. Transforms are performed before validation.

Packaged transforms include:

 * toString - convert numbers into strings
 * toInteger - convert strings into integers
 * toFloat  - convert strings into floats
 * toArray  - wrap non arrays into an array
 * toDate  - convert strings into dates
 * toBoolean - converts `>0`/`"true"`/`"on"`/`"yes"` -> `true` and `<1`/`"false"`/`"off"`/`"no"` -> `false`

See [/transforms](/transforms) for the full list. Note `basic` is included by default unless in [lite mode](#lite-mode)

Custom transforms can be registed when creating a Hannibal instance or added in-line via functions in the schema.

Usage:

```js
var schema = {
    type: "string",
    transforms: "toString"
}

var schema2 = {
    type: "string",
    transforms: ["toString", function (value) { return value.toLowerCase()}]
}
```

### schema.validators

The `validators` key of the schema provides an object containing validation criteria. Available validators are:

String:

 * regex - perform a regex match
 * min - check the minimum length
 * max - check the maximum length
 * enum - check the value is contained in a given array

Number:

 * min - minimum value
 * max - maximum value
 * enum - check the value is contained in a given array
 * minPrecision - minimum number of decimal places
 * maxPrecision - maximum number of decimal places

Date/Time:

 * min - minimum value
 * max - maximum value
 * enum - check the value is contained in a given array

Array:

 * min - check the minimum length
 * max - check the maximum length

Custom validators can be given via the `custom` key or registered with `hannibal`. Custom validators are provided with the value to validate and the argument provided in the schema.

Custom validators should throw an instance of `Error` with a message.

Usage:

```js
var schema = {
    type: "string",
    validators: {
        regex: "^word$",
        min: 4,
        max: 4,
        enum: ["word"]
    }
}
```

### schema.reducers

The `reducers` key of the schema is similar to `transforms` but are run after validation. This can be useful for compacting down empty objects or arrays.

Usage:

```js
var schema = {
    type: "string",
    reducers: function (value) {
        if (value.length === 0) {
            return null;
        } else {
            return value;
        }
    }
}
```

## Further reading

See a large [full example](docs/full_example.md) of Hannibal validating a complex user object.

Schemas can be composed together for DRY re-usable code. [Docs here](docs/composition.md).

Schemas can be customised to your requirements. [Docs here](docs/cusomisation.md).

For an in depth guide to writing your own transforms see the [guide here](docs/writing_transforms.md).

A lite version of Hannibal is available should you be using in a client where file size is critical. [Docs here](docs/lite.md).


## Test

Run tests using `npm test`.
