var expect = require("expect.js");
var hannibal = require("../../index");

describe("validator(number)", function () {

  describe("basic number", function () {
    var testSchema = hannibal({
      type: "number"
    });

    it("should validate a number", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a number", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(false);
    });
  });
});
