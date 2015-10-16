var expect = require("expect.js");
var hannibal = require("../../index");

describe("validator(object)", function () {

  describe("basic object", function () {
    var testSchema = hannibal({
      type: "object"
    });

    it("should validate a basic object", function () {
      var output = testSchema({
        name: "Hannibal"
      });

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a basic object", function () {
      var output = testSchema("string");

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.a("object").and.to.have.keys("type");
    });
  });

  describe("nested object", function () {
    var testSchema = hannibal({
      type: "object",
      schema: {
        name: {
          type: "string"
        }
      }
    });

    it("should validate a nested object", function () {

      var output = testSchema({
        name: "Hannibal"
      });

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate an incorrect nested object", function () {
      var output = testSchema({
        name: null
      });

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.a("object").and.to.have.keys("name");
      expect(output.error.name).to.be.a("object").and.to.have.keys("type");
    });

  });

  describe("deeply nested object", function () {
    var testSchema = hannibal({
      type: "object",
      schema: {
        name: {
          type: "string"
        },
        address: {
          type: "object",
          schema: {
            street: {
              type: "string"
            }
          }
        }
      }
    });

    it("should validate a nested object", function () {

      var output = testSchema({
        name: "Hannibal",
        address: {
          street: "Underground"
        }
      });

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate an incorrect nested object", function () {
      var output = testSchema({
        name: "Hannibal",
        address: {
          street: null
        }
      });

      expect(output.isValid).to.be(false);
      expect(output.error.name).to.be(undefined);
      expect(output.error.address).to.be.a("object").and.have.keys("street");
      expect(output.error.address.street).to.be.a("object").and.have.keys("type");
    });

  });

});
