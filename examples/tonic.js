var Hannibal = require("hannibal");
var hannibal = new Hannibal();

// Create a validator by adding a schema
var validator = hannibal.create({
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
var rslt = validator({
  name: "John Smith",
  age: 53,
  address: {
    street: "The underground",
    city: "Los Angeles"
  }
});

console.log(rslt);
