var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("toFloat", function () {
    var testSchema = hannibal.create({
      type: "number",
      transforms: "toFloat"
    });

    it("should turn a float into a float", function () {
      var output = testSchema(1.1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(output.data).to.eql(1.1);
    });

    it("should turn an integer into a float", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(output.data).to.eql(1.0);
    });

    it("should turn a number into a float", function () {
      var output = testSchema("2");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(output.data).to.eql(2);
    });

    it("should fail if an array if passed", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(false);
      expect(isNaN(output.data)).to.be(true);
    });

    it("should fail if an object is passed", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(false);
      expect(isNaN(output.data)).to.be(true);
    });
  });
});
