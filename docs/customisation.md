## Customising Hannibal

Hannibal provides basic validation functionality out of the box but enables easy customisation for more advanced requirements.

To customise Hannibal create a new instance passing in a configuration object. The configuration object will add to and override the default set or `transforms` and `validators`.

Usage:

```js
// Load Hannibal
var Hannibal = require("hannibal");

// Create a Hannibal instance with custom filters and validators registered
var customisedHannibal = new Hannibal({
    transforms: {
        addThe: function (value) {
            if (typeof value === "string") {
                return "The " + value;
            } else {
                return value;
            }
        }
    },
    validators: {
        string: {
            bannedHouses: function (value, attr) {
                if (value === attr) {
                    throw new Error("The A-Team can't stay in a: " + value);
                }
            }
        }
    }
});

// Create a validator from the customised Hannibal instance
var customValidator = customisedHannibal.create({
    type: "object",
    schema: {
        house: {
            type: "string",
            required: false, // If the address object is present then it must have a 'house' key
            validators: {
                bannedHouses: "Garage full of tools"
            }
        },
        street: {
            type: ["string", "null"],
            transforms: "addThe" // Use the custom transform to add 'the' infront of the name
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
});

// Now validate an object using the new schema:
var customRslt1 = customValidator({
    street: "Underground",
    city: "Los Angeles",
    country: "US"
});

// Boolean if the object is valid
assert(customRslt1.isValid);

// Show all errors from validation
assert.equal(customRslt1.error, null);

// Output valid data
assert.equal(customRslt1.street, "The Underground");

var customRslt2 = customValidator({
    house: "Garage full of tools",
    city: "Los Angeles",
    country: "US"
});

// Boolean if the object is valid
assert(!customRslt2.isValid);

// Show all errors from validation
assert.equal(customRslt2.error.house, "The A-Team can't stay in a: Garage full of tools");
```

## Customising after instantiation

Functions are available to add `transforms`, `validators` and `reducers` after instantiation.

```js
var Hannibal = require("hannibal");
var hannibal = new Hannibal();

// Add in basic validators
hannibal.addTransforms({
    toLowerCase: function (val) {
      return String(val).toLowerCase();
    }
});
hannibal.addValidators({
    string: {
        beFourCharacters: function (val) {
            return val.length === 4;
        }
    }
});
hannibal.addReducers({
  collapse: function (val) {
    if (Array.isArray(value)) {
      return val.filter(function (i) {
        return i;
      });
    } else {
      return val;
    }
  }
});

```


## Pro tips

Validators, transforms and reducers can also be added directly to a schema definition.

```js
hannibal.create({
    type: "string",
    transforms: function (value) {
        return "I'm transforming " + value + " with my additions";
    },
    validators: {
        myCustomValidator: function (value) {
            if (value.match(/plane/)) {
                throw new Error("Ain't getting on no damn plane fool")
            }
        }
    }
});
```
