var expect = require("expect.js");
var hannibal = require("../../index");


var testSchema = hannibal({
  type: "object",
  schema: {
    id: {
      type: "number",
      pre: "toInteger"
    },
    name: {
      type: "string",
      required: true
    },
    address: {
      type: "object",
      schema: {
        street: {
          type: "string",
          required: true
        },
        country: {
          type: "string",
          pre: ["toString", "toUpperCase"],
          required: true,
          validators: {
            enum: ["GB", "US", "AU"]
          }
        }
      }
    },
    contacts: {
      type: "array",
      schema: {
        type: "object",
        schema: {
          value: {
            type: "string",
            pre: ["toString", "trim"],
            required: true
          },
          type: {
            type: "string",
            required: true,
            validators: {
              enum: ["phone", "email"]
            }
          }
        }
      }
    }
  }
});

describe("examples", function () {

  describe("user", function () {
    var user = {
      id: "5",
      name: "Hannibal Smith",
      address: {
        street: "The underground",
        country: "us"
      },
      contacts: [
        {
          type: "phone",
          value: "+01 1111111111"
        }
      ]
    };

    it("should be valid", function () {
      var result = testSchema(user);

      expect(result.isValid).to.be(true);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(5);
      expect(result.data.name).to.be.a("string").and.to.equal(user.name);
      expect(result.data.address).to.be.a("object").and.to.have.keys("street", "country");
      expect(result.data.address.street).to.equal("The underground");
      expect(result.data.address.country).to.equal("US");
      expect(result.data.contacts).to.be.a("array").and.have.length(1);
      expect(result.data.contacts[0]).to.be.a("object").and.have.keys("type", "value");
      expect(result.data.contacts[0].type).to.be.a("string").and.equal("phone");
      expect(result.data.contacts[0].value).to.be.a("string").and.equal("+01 1111111111");
    });
  });
});
