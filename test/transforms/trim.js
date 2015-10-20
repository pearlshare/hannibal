var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("trim", function () {
    var testSchema = hannibal.create({
      type: "string",
      transforms: "trim"
    });

    it("should do nothing to a number", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(false);
    });

    it("should turn a string into a upper case string", function () {
      var output = testSchema("  Hannibal  ");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("Hannibal");
    });

    it("should do nothing to an array", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(false);
    });
  });
});
