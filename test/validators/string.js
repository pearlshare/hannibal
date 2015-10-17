var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validators.string", function () {
  var hannibal = new Hannibal();

  describe("min length", function () {
    var testSchema = hannibal.create({
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
    var testSchema = hannibal.create({
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

  describe("regex", function () {
    var testSchema = hannibal.create({
      type: "string",
      validators: {
        regex: "H.*$"
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
    var testSchema = hannibal.create({
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
