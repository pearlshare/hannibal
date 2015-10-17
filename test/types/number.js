var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validator(number)", function () {
  var hannibal = new Hannibal();

  describe("basic number", function () {
    var testSchema = hannibal.create({
      type: "number"
    });

    it("should validate a number", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a number", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.a("object").and.to.have.keys("type");
    });
  });
});
