## Example

This is a large, annotated schema for learn-by-example types :).

Other examples of Hannibal schemas can be found in the tests.

Usage:

```js
var Hannibal = require("hannibal");
// Create a validator from the customised Hannibal instance
var validator = hannibal.create({
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
            transforms: "toInteger", // before validation perform a built in function
            validators: {
                min: 0, // min value
                max: 120 // max value
            }
        },
        phone: {
            type: "string",
            validators: {
                regex: "^\\+\\d{2,3}\\s\\d{10,12}$" // Check regex match
            }
        },
        gender: {
            type: "string",
            validators: {
                enum: ["male", "female"] // value must be one of male/female
            }
        },
        address: {
            type: ["object", "null"], // allow an object or null
            schema: {
                house: {
                    type: "string",
                    required: true // If the address object is present then it must have a 'house' key
                },
                street: {
                    type: ["string", "null"]
                },
                city: {
                    type: "string",
                    required: true
                },
                country: {
                    type: "string",
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
            transforms: "toDate" // cast date string into date
        }
    }
});

// Now validate an object using the new schema:
var customRslt1 = validator({
    name: "Hannibal Smith",
    age: "53",
    phone: "+01 2233445566",
    gender: "male",
    address: {
        street: "Underground",
        city: "Los Angeles",
        country: "US"
    },
    dateOfBirth: "Fri Oct 16 1955 12:15:35 GMT+0100 (BST)"
});

// Boolean if the object is valid
assert(customRslt1.isValid);

// Show all errors from validation
assert.equal(customRslt1.error, null);

// Output valid data
assert.equal(customRslt1.data.name, "Hannibal Smith");
assert.equal(customRslt1.data.age, 53);
assert.equal(customRslt1.address.street, "Underground");
```
