var expect = require("expect.js");
var hannibal = require("../../index");

describe("validator(array)", function () {

  describe("basic array", function () {
    var testSchema = hannibal({
      type: "array"
    });

    it("should validate an array", function () {
      var output = testSchema([]);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not an array", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(false);
    });
  });

  describe("nested array", function () {
    var testSchema = hannibal({
      type: "array",
      schema: {
        type: "string"
      }
    });

    it("should validate an array", function () {
      var output = testSchema(["test"]);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a valid nested array", function () {
      var output = testSchema([1]);

      expect(output.isValid).to.be(false);
    });
  });

  describe("nested array of arrays", function () {
    var testSchema = hannibal({
      type: "array",
      schema: {
        type: "array",
        schema: {
          type: "string"
        }
      }
    });

    it("should validate an array", function () {
      var output = testSchema([["test"]]);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a valid nested array", function () {
      var output = testSchema([[1]]);

      expect(output.isValid).to.be(false);
    });
  });

  describe("nested array of objects", function () {
    var testSchema = hannibal({
      type: "array",
      schema: {
        type: "object",
        schema: {
          name: {
            type: "string"
          }
        }
      }
    });

    it("should validate an array", function () {
      var output = testSchema([
        {
          name: "Hannibal"
        }
      ]);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a valid nested array", function () {
      var output = testSchema([
        {
          name: null
        }
      ]);

      expect(output.isValid).to.be(false);
    });
  });
});
