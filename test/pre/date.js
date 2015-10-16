var expect = require("expect.js");
var hannibal = require("../../index");

describe("pre", function () {

  describe("date", function () {
    var testSchema = hannibal({
      type: "date",
      pre: "toDate"
    });

    it("should coerce a string into a date", function () {
      var date = (new Date()).toString();
      var output = testSchema(date);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a(Date);
      expect(output.data).to.eql(new Date(date));
    });
  });
});
