var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("date", function () {
    var testSchema = hannibal.create({
      type: "date",
      transforms: "toDate"
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
