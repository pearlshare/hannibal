var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("toInteger", function () {
    var testSchema = hannibal.create({
      type: "number",
      transforms: "toInteger"
    });

    it("should turn a float into an integer", function () {
      var output = testSchema(1.1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(output.data).to.eql(1);
    });

    it("should turn an integer into an integer", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(output.data).to.eql(1);
    });

    it("should turn a number into an integer", function () {
      var output = testSchema("2");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(output.data).to.eql(2);
    });

    it("should turn an array into a NaN", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(isNaN(output.data)).to.be(true);
    });

    it("should turn an object into a NaN", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(isNaN(output.data)).to.be(true);
    });
  });
});
