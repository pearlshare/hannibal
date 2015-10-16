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
    });
  });

  describe("nested object", function () {
    var testSchema = hannibal({
      type: "object",
      schema: {
        name: {
          type: "string",
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
    });

  });

  describe("deeply nested object", function () {
    var testSchema = hannibal({
      type: "object",
      schema: {
        name: {
          type: "string",
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
    });

  });

});