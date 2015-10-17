var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validators", function () {
  var hannibal = new Hannibal();

  describe("custom", function () {
    var testSchema = hannibal.create({
      type: "string",
      validators: {
        custom: function (value) {
          if (value !== "Hannibal") {
            throw new Error("Value is not equal to 'Hannibal'");
          }
        }
      }
    });

    it("should validate Hannibal", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Hannibal");
    });

    it("should fail to validate if too short", function () {
      var output = testSchema("Ha");

      expect(output.isValid).to.be(false);
    });
  });
});
