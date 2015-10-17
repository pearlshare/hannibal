var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validator(date)", function () {
  var hannibal = new Hannibal();

  describe("basic date", function () {
    var testSchema = hannibal.create({
      type: "date"
    });

    it("should validate a number", function () {
      var output = testSchema(new Date());

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a number", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(false);
      expect(output.error).to.be.a("object").and.to.have.keys("type");
    });
  });
});
