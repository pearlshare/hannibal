var expect = require("expect.js");
var Hannibal = require("../../index");
var hannibal = new Hannibal({
  transforms: require("../../transforms/string")
});

var testSchema = hannibal.create({
  type: "object",
  schema: {
    friends: {
      type: "array",
      schema: {
        type: "object",
        schema: {
          name: {
            type: "string",
            required: true,
            validators: {
              enum: ["Fred", "Barnery"]
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
      }
    }
  }
});

describe("errors", function () {

  describe("nested arrays", function () {

    it("should be invalid and have a friends[0].name.required error", function () {
      var user = {
        friends: [
          {
            contacts: [
              {
                type: "phone",
                value: "+01 111111111"
              }
            ]
          }
        ]
      };
      var result = testSchema(user);
      expect(result.error).to.be.a("object");
      expect(result.error.friends).to.be.an("array");
      expect(result.error.friends[0]).to.have.keys("name");
      expect(result.error.friends[0].name).to.have.keys("required");
    });

    it("should be invalid and have a friends[1].contacts error", function () {
      var user = {
        friends: [
          {
            name: "Fred",
            contacts: [
              {
                type: "phone",
                value: "+01 111111111"
              }
            ]
          },
          {
            contacts: [
              {
                type: "phone",
                value: "+01 111111111"
              },
              {
                type: null,
                value: "+01 111111112"
              }
            ]
          }
        ]
      };
      var result = testSchema(user);
      expect(result.error).to.be.a("object");
      expect(result.error.friends).to.be.an("array");
      expect(result.error.friends[0]).to.be(undefined);
      expect(result.error.friends[1]).to.have.keys("name", "contacts");
      expect(result.error.friends[1].name).to.have.keys("required");
      expect(result.error.friends[1].name.required).to.be.a("string").and.match(/provided/);
      expect(result.error.friends[1].contacts).to.be.a("array");
      expect(result.error.friends[1].contacts[0]).to.be(undefined);
      expect(result.error.friends[1].contacts[1].type).to.be.a("object");
      expect(result.error.friends[1].contacts[1].type.type).to.be.a("string").and.match(/null/);
    });
  });
});
