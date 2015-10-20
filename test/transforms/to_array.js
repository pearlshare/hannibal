var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe("toArray", function () {
    var testSchema = hannibal.create({
      type: "array",
      transforms: "toArray"
    });

    it("should turn a number into a number", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("array");
      expect(output.data).to.eql([1]);
    });

    it("should turn a string into a number", function () {
      var output = testSchema("2");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("array");
      expect(output.data).to.eql(["2"]);
    });

    it("should turn an array into a NaN", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("array");
      expect(output.data).to.eql(["Hannibal", "Face"]);
    });

    it("should turn an object into a string", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("array");
      expect(output.data).to.eql([{name: "Hannibal"}]);
    });
  });
});
