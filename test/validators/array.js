var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validators.array", function () {
  var hannibal = new Hannibal();

  describe("min length", function () {
    var testSchema = hannibal.create({
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
    var testSchema = hannibal.create({
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
