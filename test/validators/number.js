var expect = require("expect.js");
var hannibal = require("../../index");

describe("validators.number", function () {

  describe("min Value", function () {
    var testSchema = hannibal({
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

  describe("max Value", function () {
    var testSchema = hannibal({
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

  describe("enum", function () {
    var testSchema = hannibal({
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
