var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validators.number", function () {
  var hannibal = new Hannibal();

  describe("min Value", function () {
    var testSchema = hannibal.create({
      type: "number",
      validators: {
        min: 5
      }
    });

    it("should validate if bigger", function () {
      var output = testSchema(6);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if smaller", function () {
      var output = testSchema(4);

      expect(output.isValid).to.be(false);
    });
  });

  describe("min Precision", function () {
    var testSchema = hannibal.create({
      type: "number",
      validators: {
        minPrecision: 2
      }
    });

    it("should validate if more precise", function () {
      var output = testSchema(6.23);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if less precise", function () {
      var output = testSchema(4.1);

      expect(output.isValid).to.be(false);
    });
  });

  describe("max Value", function () {
    var testSchema = hannibal.create({
      type: "number",
      validators: {
        max: 5
      }
    });

    it("should validate if smallers", function () {
      var output = testSchema(5);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if bigger", function () {
      var output = testSchema(6);

      expect(output.isValid).to.be(false);
    });
  });

  describe("max Precision", function () {
    var testSchema = hannibal.create({
      type: "number",
      validators: {
        maxPrecision: 2
      }
    });

    it("should validate if less precise", function () {
      var output = testSchema(5.12);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if more precise", function () {
      var output = testSchema(6.123);

      expect(output.isValid).to.be(false);
    });
  });

  describe("enum", function () {
    var testSchema = hannibal.create({
      type: "number",
      validators: {
        enum: [5, 6]
      }
    });

    it("should validate if included", function () {
      var output = testSchema(5);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too long", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(false);
    });
  });
});
