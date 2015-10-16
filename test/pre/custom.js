var expect = require("expect.js");
var hannibal = require("../../index");

describe("pre", function () {

  describe("custom", function () {
    var testSchema = hannibal({
      type: "string",
      pre: function (value) {
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
