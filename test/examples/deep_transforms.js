var expect = require("expect.js");
var Hannibal = require("../../index");
var hannibal = new Hannibal({
  transforms: require("../../transforms/string")
});

function collapseArray (value) {
  if (Array.isArray(value) && value.filter(function (c) {
    return c;
  }).length === 0) {
    return undefined;
  }
  return value;
}

function collapseObject (value) {
  if (value && Object.keys(value).length === 0) {
    return undefined;
  }
  return value;
}

var testSchema = hannibal.create({
  type: "object",
  schema: {
    address: {
      type: "object",
      required: true,
      transforms: collapseObject,
      schema: {
        street: {
          type: "string"
        },
        country: {
          type: "string"
        },
        otherDetails: {
          type: "object",
          transforms: collapseObject
        }
      }
    },
    contacts: {
      type: "array",
      required: true,
      transforms: collapseArray,
      schema: {
        type: "object",
        transforms: collapseObject,
        schema: {
          value: {
            type: "string"
          },
          type: {
            type: "string"
          },
          alternateContacts: {
            type: "array",
            transforms: collapseArray
          }
        }
      }
    }
  }
});

describe("examples", function () {

  describe("deep transforms", function () {

    it("should be valid with exact matches", function () {
      var user = {
        address: {
          street: "The underground",
          country: "us",
          otherDetails: {
            taxCode: "US1"
          }
        },
        contacts: [
          {
            type: "phone",
            value: "+01 111111111",
            alternateContacts: [
              {
                type: "phone",
                value: "+01 111111111"
              }
            ]
          }
        ]
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(true);
      expect(result.data).to.be.a("object");
      expect(result.data.address).to.be.a("object").and.to.have.keys("street", "country", "otherDetails");
      expect(result.data.address.street).to.equal("The underground");
      expect(result.data.address.country).to.equal("us");
      expect(result.data.contacts).to.be.a("array").and.have.length(1);
      expect(result.data.contacts[0]).to.be.a("object").and.have.keys("type", "value", "alternateContacts");
      expect(result.data.contacts[0].type).to.be.a("string").and.equal("phone");
      expect(result.data.contacts[0].value).to.be.a("string").and.equal("+01 111111111");
      expect(result.data.contacts[0].alternateContacts).to.be.an("array").and.have.length(1);
      expect(result.data.contacts[0].alternateContacts[0]).to.be.an("object").and.have.keys("type", "value");
    });

    it("should collapse empty objects from deep levels to the top and fail a top level required check", function () {
      var user = {
        address: {
          otherDetails: {}
        },
        contacts: [
          {
            type: "phone",
            value: "+01 111111111",
            alternateContacts: [
              {
                type: "phone",
                value: "+01 111111111"
              }
            ]
          }
        ]
      };
      var result = testSchema(user);
      expect(result.isValid).to.be(false);
      expect(result.error).to.be.an("object").and.have.keys("address");
      expect(result.data).to.be.a("object").and.have.keys("contacts");
    });

    it("should collapse empty arrays from top levels and fail a top level required check", function () {
      var user = {
        address: {
          street: "The underground",
          country: "us",
          otherDetails: {
            taxCode: "US1"
          }
        },
        contacts: []
      };
      var result = testSchema(user);
      expect(result.isValid).to.be(false);
      expect(result.data).to.be.a("object").and.have.keys("address").and.to.not.have.keys("contacts");
      expect(result.error).to.be.an("object").and.have.keys("contacts");
    });

    it("should collapse empty arrays from the deepest level to the top and fail a top level required check", function () {
      var user = {
        address: {
          street: "The underground",
          country: "us",
          otherDetails: {
            taxCode: "US1"
          }
        },
        contacts: [
          {
            alternateContacts: []
          }
        ]
      };
      var result = testSchema(user);
      expect(result.isValid).to.be(false);
      expect(result.data).to.be.a("object").and.have.keys("address").and.to.not.have.keys("contacts");
      expect(result.error).to.be.an("object").and.have.keys("contacts");
    });
  });
});
