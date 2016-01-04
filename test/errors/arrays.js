var expect = require("expect.js");
var Hannibal = require("../../index");
var hannibal = new Hannibal({
  transforms: require("../../transforms/string")
});

var testSchema = hannibal.create({
  type: "object",
  schema: {
    name: {
      type: "string",
      required: true
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

describe("errors", function () {

  describe("arrays", function () {

    it("should be invalid and have a contacts[0].type.required error", function () {
      var user = {
        name: "Fred",
        contacts: [
          {
            value: "+01 111111111"
          }
        ]
      };
      var result = testSchema(user);
      expect(result.error).to.be.a("object");
      expect(result.error.contacts).to.be.an("array");
      expect(result.error.contacts[0]).to.have.keys("type");
      expect(result.error.contacts[0].type).to.have.keys("required");
    });

    it("should be invalid and have a contacts[0].type.enum error", function () {
      var user = {
        name: "Fred",
        contacts: [
          {
            type: "fish",
            value: "+01 111111111"
          }
        ]
      };
      var result = testSchema(user);
      expect(result.error).to.be.a("object");
      expect(result.error.contacts).to.be.an("array");
      expect(result.error.contacts[0]).to.have.keys("type");
      expect(result.error.contacts[0].type).to.have.keys("enum");
    });

    it("should be invalid and have a error", function () {
      var user = {
        name: "Fred",
        contacts: [
          {
            type: "phone",
            value: "+01 111111111"
          },
          {
            type: "fish",
            value: "+01 111111112"
          }
        ]
      };
      var result = testSchema(user);
      expect(result.error).to.be.a("object");
      expect(result.error.contacts).to.be.an("array").and.have.length(2);
      expect(result.error.contacts[0]).to.be(undefined);
      expect(result.error.contacts[1]).to.be.an("object").and.to.have.keys("type");
      expect(result.error.contacts[1].type).to.have.keys("enum");
    });
  });
});
