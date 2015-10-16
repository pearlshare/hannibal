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
        type: "string",
        validators: {
            required: true // If the key is missing will raise error
        }
    },
    age: {
        type: ["integer", "null"], // allow integer or null value
        pre: "toInt", // before validation perform a built in function
        validators: {
            min: 0,
            max: 120
        }
    },
    phone: {
        type: "string",
        aliases: ["contact"] // rename 'contact' to 'phone' and validate
        validators: {
            regex: /^\+\d{2,3}\s\d{8-12}+$/ // Check regex match
        }
    },
    address: {
        type: ["object", "null"],
        
    }
}
```

## Test