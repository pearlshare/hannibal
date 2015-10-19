# Hannibal

![circleci](https://circleci.com/gh/oliverbrooks/hannibal.png?style=shield)
![Dependency Status](https://david-dm.org/oliverbrooks/hannibal.svg)
![Dev Dependency Status](https://david-dm.org/oliverbrooks/hannibal/dev-status.svg)

![love it when a plan comes together](https://images.rapgenius.com/530583e79e4fc7f75855995d511e185c.400x294x1.jpg)

## Objectives

Validate a JavaScript object, array or primitive and provide clear error reporting where the object is not valid.

Provide a means to extend the validator functionality using plain JavaScript functions.

Provide a handy set of common validations such as min/max values, regex and enums without going overboard.

Be fast and lightweight.

## Setup

Aim of setup is to configure Hannibal to your requirements. This is done by creating a new instance passing an optional customisation object. The customisation object will be added to or override the default set or `transforms` and `validators`.

Note that without a customisation object Hannibal will use the default pre and validators.

```js
var Hannibal = require("hannibal");

// Create a validator with custom filters and validators registered
var hannibal = new Hannibal({
    // Add a custom set of transform functions
    transforms: {
        addThe: function (value) {
            if (typeof value === "string") {
                return "The " + value;
            } else {
                return value;
            }
        }
    },
    // Add custom validators
    validators: {
        string: {
            bannedHouses: function (attr, value) {
                if (value === attr) {
                    throw new Error("The A-Team can't stay in a: " + value);
                }
            }
        }
    }
});
```

## Schema definition

The schema defines the object to be validated. It is configuration which Hannibal will load and validate values against.

An objective of the schema is to be able to store as a JSON string to be portable across platforms.

Note the example below shows many of the features of Hannibal including custom validator and transforms which can't be serialized to JSON.  To do so they can be registered as per setup and called using their keys.

```js
var schema = {
    type: "object",
    schema: {
        name: {
            type: "string", // value must be a string if present
            required: true, // If the key is missing will raise error
            validators: {
                min: 2, // Minimum value string length
                max: 50 // Maximum value string length
            }
        },
        age: {
            type: ["number", "null"], // value must be an number or null
            transforms: "toInt", // before validation perform a built in function
            validators: {
                min: 0, // min value
                max: 120 // max value
            }
        },
        phone: {
            type: "string",
            validators: {
                regex: "\+\d{2,3}\s\d{10,12}$" // Check regex match
            }
        },
        gender: {
            type: "string",
            validators: {
                enum: ["male", "female"] // value must be one of male/female
            }
        },
        petName: {
            type: "string",
            validators: {
                // Run a completely custom validator
                isFluffy: function (value) {
                    if (value.slice(value.length - 2, value.length) !== "fy") {
                        throw new Error ("should end in fy, like 'fluffy'")
                    }
                }
            }
        },
        address: {
            type: ["object", "null"], // allow an object or null
            schema: {
                house: {
                    type: "string",
                    required: true // If the address object is present then it must have a 'house' key
                    validators: {
                        bannedHouses: "Garage full of tools"
                    }
                },
                street: {
                    type: ["string", "null"],
                    transforms: "addThe"
                },
                city: {
                    type: "string",
                    required: true,
                },
                country: {
                    type: "string",
                    transforms: "toUppercase"
                    required: true,
                    validators: {
                        enum: ["GB", "US", "AU"]
                    }
                }
            }
        },
        dateOfBirth: {
            type: "date", // value must be a date object
            required: true,
            transforms: [
                // custom function to convert unix timestamp to date
                function (value) {
                    if (typeof value === "number") {
                        obj[key] = new Date(value * 1000);
                    }
                },
                "toDate" // cast date string into date
            ]
        }
        
    }
};
```

## Usage

When Hannibal is customised and the schema defined objects can be validated.

```js
// Create a test function
var testSchema = hannibal.create(schema);

var inputData1 = {
    name: "Hannibal Smith",
    age: 53,
    phone: "+01 2233445566",
    gender: "male",
    petName: "goofy",
    address: {
        street: "Underground",
        city: "Los Angeles",
        country: "US"
    },
    dateOfBirth: "Fri Oct 16 1955 12:15:35 GMT+0100 (BST)"
};

var plan1 = testSchema(inputData);

// Boolean if the object is valid
plan1.isValid // true

// Show all errors from validation
plan1.errors // null

// Output valid data
plan1.data // {name: "Hannibal Smith", ...}


var inputData2 = {
    name: "B A Baracus",
    age: 38,
    phone: "+01 6665554443",
    gender: "male",
    petName: "fudge",
    address: {
        city: "Los Angeles",
        country: "US"
    }
};

var plan2 = testSchema(inputData2)

// Boolean if the object is valid
plan2.isValid // false

// Show all errors from validation
plan2.errors // {petName: {isFluffy: "should end in fy, like 'fluffy'"}}, {address: {street: {required: "key was not provided"}}, {dateOfBirth: {required: "key was not provided"}}]

// Output valid data
plan2.data // {name: "B A Baracus", age: 38, ...}
```

## Schema building

### Types

Types represent the primitive types allowed. These are provided as either a string or array of strings.

Available types:

 * string
 * date
 * boolean
 * time
 * number
 * array
 * object
 * null

### Transforms

Transform functions are run before validation and can be used to convert a value. These are provided as a single or array of strings or functions.

Packaged transforms include:

 * toString - convert numbers into strings
 * toInteger - convert strings into integers
 * toFloat  - convert strings into floats
 * toDate  - convert strings into dates
 * toArray  - wrap non arrays into an array

See `lib/transforms` for the full list.

Custom transform functions can be added in-line via functions or registered into Hannibal. The functions take the value and any options passed when performing validation:

```js
var Hannibal = require("hannibal");
var hannibal = new Hannibal();
var validator = hannibal.create({
    type: "number",
    transforms: function (value, opts) {
        return value * opts.multiplier
    }
});
console.log(validator(2)) // {isValid: true, data: 10, ...}

```


### Required

When set to `true` the required statement will error if the given key is not provided in the input object. Note this does not check the value, purely the presence of the key.

### Aliases

Aliases will convert a set of key names to the given key. Aliases can be provided a string or array of strings.

### Validators

Validators check the value against a set of criteria. Available validators are:

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

Custom validators can be given via the `custom` key or registered with `hannibal`. Custom validators are provided with the value to validate.

Custom validators should throw an instance of `Error` with a message.

## Test

Run tests using `npm test`.

## TODO

* Add alias functionality to rename keys
* Validate incoming schema
    - perhaps use hannibal on itself?!?
* 
