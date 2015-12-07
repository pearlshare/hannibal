var expect = require("expect.js");
var Hannibal = require("../../index");
var hannibal = new Hannibal({
  transforms: require("../../transforms/string")
});

var testSchema = hannibal.create({
  type: "object",
  schema: {
    id: {
      type: "number",
      transforms: "toInteger"
    },
    name: {
      type: "string",
      required: true
    },
    aka: {
      type: ["string", "null"],
      required: true
    },
    address: {
      type: "object",
      required: true,
      schema: {
        street: {
          type: "string",
          required: true
        },
        country: {
          type: "string",
          transforms: ["toString", "toUpperCase"],
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
            transforms: ["toString", "trim"],
            required: true,
            validators: {
              min: 9,
              max: 13
            }
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

  describe("valid user", function () {

    it("should be valid with exact matches", function () {
      var user = {
        id: "5",
        name: "John Smith",
        aka: "Hannibal",
        address: {
          street: "The underground",
          country: "us"
        },
        contacts: [
          {
            type: "phone",
            value: "+01 111111111"
          }
        ]
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(true);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(5);
      expect(result.data.name).to.be.a("string").and.to.equal(user.name);
      expect(result.data.aka).to.be.a("string").and.to.equal(user.aka);
      expect(result.data.address).to.be.a("object").and.to.have.keys("street", "country");
      expect(result.data.address.street).to.equal("The underground");
      expect(result.data.address.country).to.equal("US");
      expect(result.data.contacts).to.be.a("array").and.have.length(1);
      expect(result.data.contacts[0]).to.be.a("object").and.have.keys("type", "value");
      expect(result.data.contacts[0].type).to.be.a("string").and.equal("phone");
      expect(result.data.contacts[0].value).to.be.a("string").and.equal("+01 111111111");
      expect(result.data.favouritePet).to.be(undefined);
    });

    it("should be valid with extra fields removed", function () {
      var user = {
        id: "6",
        name: "Howling Mad Murdoch",
        aka: null,
        address: {
          street: "The underground",
          country: "us"
        },
        favouritePet: "HELLicOpter",
        contacts: [
          {
            type: "phone",
            value: "+01 222222222"
          }
        ]
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(true);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(6);
      expect(result.data.name).to.be.a("string").and.to.equal(user.name);
      expect(result.data.aka).to.be(null);
      expect(result.data.address).to.be.a("object").and.to.have.keys("street", "country");
      expect(result.data.address.street).to.equal("The underground");
      expect(result.data.address.country).to.equal("US");
      expect(result.data.contacts).to.be.a("array").and.have.length(1);
      expect(result.data.contacts[0]).to.be.a("object").and.have.keys("type", "value");
      expect(result.data.contacts[0].type).to.be.a("string").and.equal("phone");
      expect(result.data.contacts[0].value).to.be.a("string").and.equal("+01 222222222");
      expect(result.data.favouritePet).to.be(undefined);
    });

    it("should be valid with optional fields missing", function () {
      var user = {
        id: "7",
        name: "Templeton Peck",
        aka: "Face",
        address: {
          street: "The underground",
          country: "us"
        }
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(true);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(7);
      expect(result.data.name).to.be.a("string").and.to.equal(user.name);
      expect(result.data.address).to.be.a("object").and.to.have.keys("street", "country");
      expect(result.data.address.street).to.equal("The underground");
      expect(result.data.address.country).to.equal("US");
      expect(result.data.contacts).to.be(undefined);
    });
  });

  describe("invalid user", function () {

    it("should be invalid with required fields missing", function () {
      var user = {
        id: "8",
        name: "B A Baracus",
        address: {
          country: "us"
        }
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(false);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(8);
      expect(result.data.name).to.be.a("string").and.to.equal(user.name);
      expect(result.data.aka).to.be(undefined);
      expect(result.data.address).to.be.a("object").and.to.have.keys("country");
      expect(result.data.address.country).to.equal("US");
      expect(result.data.favouritePet).to.be(undefined);
      expect(result.error.address).to.be.an("object").and.to.have.keys("street");
      expect(result.error.address.street).to.be.an("object").and.have.keys("required");
      expect(result.error.aka).to.be.an("object").and.have.keys("required");
    });

    it("should be invalid with fields with the wrong type", function () {
      var user = {
        id: "8",
        name: 2,
        aka: "fish",
        address: {
          country: "us"
        }
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(false);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(8);
      expect(result.data.name).to.be(undefined);
      expect(result.data.address).to.be.a("object").and.to.have.keys("country");
      expect(result.data.address.country).to.equal("US");
      expect(result.data.favouritePet).to.be(undefined);
      expect(result.error.address).to.be.an("object").and.to.have.keys("street");
      expect(result.error.address.street).to.be.an("object").and.have.keys("required");
      expect(result.error.name).to.be.a("object").and.have.keys("type");
    });

    it("should be invalid with fields with the wrong type", function () {
      var user = {
        id: "5",
        name: "John Smith",
        aka: "Hannibal",
        address: {
          street: "The underground",
          country: "us"
        },
        contacts: [
          {
            type: "phone",
            value: "+01 111111111"
          },
          {
            type: "pigeon",
            value: "written note"
          }
        ]
      };
      var result = testSchema(user);

      expect(result.isValid).to.be(false);
      expect(result.data).to.be.a("object");
      expect(result.data.id).to.be.a("number").and.to.equal(5);
      expect(result.data.name).to.be.a("string").and.to.equal(user.name);
      expect(result.data.aka).to.be.a("string").and.to.equal(user.aka);
      expect(result.data.address).to.be.a("object").and.to.have.keys("street", "country");
      expect(result.data.address.street).to.equal("The underground");
      expect(result.data.address.country).to.equal("US");
      expect(result.error.contacts).to.be.an("array").and.to.have.length(2);
      expect(result.error.contacts[0]).to.be(undefined);
      expect(result.error.contacts[1]).to.be.an("object");
      expect(result.error.contacts[1].type).to.be.an("object").and.have.keys("enum");
      expect(result.error.contacts[1].type.enum).to.match(/pigeon/);
    });
  });
});
