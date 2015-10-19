var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("custom", function () {
    var testSchema = hannibal.create({
      type: "string",
      transforms: function (value) {
        if (value === "Hannibal") {
          return value;
        } else {
          return "Not Hannibal";
        }
      }
    });

    it("should return 'Hannibal'", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Hannibal");
    });

    it("should return 'Not Hannibal'", function () {
      var output = testSchema("Ha");

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Not Hannibal");
    });
  });
});
