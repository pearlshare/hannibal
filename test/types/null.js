var expect = require("expect.js");
var hannibal = require("../../index");

describe("validator(null)", function () {

  describe("null", function () {
    var testSchema = hannibal({
      type: "null"
    });

    it("should validate a null entry", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a number", function () {
      var output = testSchema("fish");

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.a("object").and.to.have.keys("type");
    });
  });
});
