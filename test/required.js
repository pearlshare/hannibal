var expect = require("expect.js");
var Hannibal = require("../index");

describe("validator required", function () {
  var hannibal = new Hannibal();
  var hannibal = new Hannibal();

  describe("required true", function () {
    var testSchema = hannibal.create({
      required: true
    });

    it("should return true if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a string", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(false);
    });
  });

  describe("required false", function () {
    var testSchema = hannibal.create({
      required: false
    });

    it("should return true if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a string", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(true);
    });
  });

  describe("nested object require", function () {
    var testSchema = hannibal.create({
      schema: {
        name: {
          required: true
        }
      }
    });

    it("should return true if a value is given", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
    });

    it("should return true if a object is not given", function () {
      var output = testSchema();

      expect(output.isValid).to.be(true);
      expect(output.data).to.be(undefined);
    });

    it("should fail to validate if name isn't defined", function () {
      var output = testSchema({});

      expect(output.isValid).to.be(false);
      expect(output.data).to.be.a("object").and.not.have.keys("name");
      expect(output.error.name).to.be.a("object").and.have.keys("required");
    });
  });
});
