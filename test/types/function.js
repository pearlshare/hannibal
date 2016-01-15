var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validator(function)", function () {
  var hannibal = new Hannibal();

  describe("basic function", function () {
    var testSchema = hannibal.create({
      type: "function"
    });

    it("should validate a basic function", function () {
      var output = testSchema(function () {});

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a basic function", function () {
      var output = testSchema("string");

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.a("object").and.to.have.keys("type");
    });
  });

});
