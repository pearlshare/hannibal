var expect = require("expect.js");
var hannibal = require("../../index");

describe("validator(string)", function () {

  describe("basic string", function () {
    var testSchema = hannibal({
      type: "string"
    });

    it("should validate a string", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a string", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(false);
    });
  });
});
