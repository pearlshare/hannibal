# Hannibal

## Objectives

Validate a JSON object and provide clear error reporting where the object is not valid.

Provide a means to extend the validator functionality using plain JavaScript functions.

Provide a limited set of handy shortcut functions for common validations such as regex and enums.

Be fast and lightweight.

## Features

```js
var schema = {
    name: {
        type: "string", // value must be a string if present
        required: true, // If the key is missing will raise error
        validators: {
            min: 2, // Minimum value string length
            max: 50 // Maximum value string length
        }
    },
    age: {
        type: ["integer", "null"], // value must be an integer or null
        pre: "toInt", // before validation perform a built in function
        validators: {
            min: 0, // min value
            max: 120 // max value
        }
    },
    phone: {
        type: "string",
        aliases: ["contact"] // rename 'contact' to 'phone' and validate
        validators: {
            regex: /\+\d{2,3}\s\d{10,12}$/ // Check regex match
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
            // Run a completely custom validator which throws errors
            custom: function (value) {
                if (value.slice(value.length -2, value.length) !== "fy") {
                    throw new Error ("petName should end in fy, like 'fluffy'")
                }
            }
        }
    },
    address: {
        type: ["object", "null"], // allow an object or null
        schema: {
            house: {
                type: "string",
                validators: {
                    required: true // If the address object is present then it must have a 'house' key
                }
            },
            street: {
                type: ["string", "null"]
            },
            city: {
                type: "string",
                validators: {
                    required: true
                }
            },
            country: {
                type: "string",
                pre: "toUppercase"
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
        pre: function (obj, key, value) {
            // custom function to convert unix timestamp to date
            if (typeof value === "number") {
                obj[key] = new Date(value*1000);
            }
        }
    }
}
```

## Test