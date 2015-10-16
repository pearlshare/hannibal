var expect = require("expect.js");
var hannibal = require("../../index");

describe("pre", function () {

  describe("compact", function () {
    var testSchema = hannibal({
      type: "array",
      pre: "compact"
    });

    it("should remove empty values from an array", function () {
      var output = testSchema([1, undefined, false, null, 0, "0"]);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("array");
      expect(output.data).to.eql([1, "0"]);
    });
  });
});
