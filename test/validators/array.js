var expect = require("expect.js");
var hannibal = require("../../index");

describe("validators.array", function () {

  describe("min length", function () {
    var testSchema = hannibal({
      type: "array",
      validators: {
        min: 2
      }
    });

    it("should validate a array", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too short", function () {
      var output = testSchema(["Hannibal"]);

      expect(output.isValid).to.be(false);
    });
  });

  describe("max length", function () {
    var testSchema = hannibal({
      type: "array",
      validators: {
        max: 1
      }
    });

    it("should validate a array", function () {
      var output = testSchema(["Hannibal"]);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if too long", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(false);
    });
  });
});
