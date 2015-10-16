var expect = require("expect.js");
var hannibal = require("../../index");

describe("validators.string", function () {

  describe("min length", function () {
    var testSchema = hannibal({
      type: "string",
      validators: {
        min: 5
      }
    });

    it("should validate a string", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too short", function () {
      var output = testSchema("Ha");

      expect(output.isValid).to.be(false);
    });
  });

  describe("max length", function () {
    var testSchema = hannibal({
      type: "string",
      validators: {
        max: 5
      }
    });

    it("should validate a string", function () {
      var output = testSchema("Hanni");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too long", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(false);
    });
  });

  describe("match", function () {
    var testSchema = hannibal({
      type: "string",
      validators: {
        match: "H.*$"
      }
    });

    it("should validate a string", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too long", function () {
      var output = testSchema("fish");

      expect(output.isValid).to.be(false);
    });
  });

  describe("enum", function () {
    var testSchema = hannibal({
      type: "string",
      validators: {
        enum: ["Hannibal"]
      }
    });

    it("should validate a string", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too long", function () {
      var output = testSchema("fish");

      expect(output.isValid).to.be(false);
    });
  });
});
