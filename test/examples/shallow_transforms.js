var expect = require("expect.js");
var Hannibal = require("../../index");

describe("Shallow transforms", function () {
  var hannibal = new Hannibal();

  describe("toArray", function () {

    describe("nested array of numbers", function () {
      var testSchema = hannibal.create({
        type: "array",
        transforms: "toArray",
        schema: {
          type: "number"
        }
      });

      it("should validate an array", function () {
        var output = testSchema([1]);

        expect(output.isValid).to.be(true);
      });

      it("should transform a number into an array and validate", function () {
        var output = testSchema(1);

        expect(output.isValid).to.be(true);
      });

      it("should transform a string into an array and fail to validate", function () {
        var output = testSchema("fish");

        expect(output.isValid).to.be(false);
        expect(output.error).to.be.a("array").and.to.have.length(1);
        expect(output.error[0]).to.be.a("object").and.to.have.keys("type");
      });

      it("should fail to validate if the transformed array is not valid", function () {
        var output = testSchema(["fish"]);

        expect(output.isValid).to.be(false);
        expect(output.error).to.be.a("array").and.to.have.length(1);
        expect(output.error[0]).to.be.a("object").and.to.have.keys("type");
      });

      it("should fail to validate if not a valid nested array", function () {
        var output = testSchema(["1"]);

        expect(output.isValid).to.be(false);
        expect(output.error).to.be.a("array").and.to.have.length(1);
        expect(output.error[0]).to.be.a("object").and.to.have.keys("type");
      });
    });

  });
});
