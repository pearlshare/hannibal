var expect = require("expect.js");
var Hannibal = require("../index");

describe("validator default", function () {
  var hannibal = new Hannibal();

  describe("default", function () {
    var testSchema = hannibal.create({
      default: "Face"
    });

    it("should return true if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a string", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Face");
    });
  });

  describe("default with required", function () {
    var testSchema = hannibal.create({
      default: "Face",
      required: true
    });

    it("should return true if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if not a string", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Face");
    });
  });

  describe("default false", function () {
    var testSchema = hannibal.create({
      default: false
    });

    it("should return true if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Hannibal");
    });

    it("should fail to validate if not a string", function () {
      var output = testSchema();

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql(false);
    });
  });

  describe("nested object default", function () {
    var testSchema = hannibal.create({
      schema: {
        name: {
          type: "string",
          default: "Face"
        }
      }
    });

    it("should return true if a value is given", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql({name: "Hannibal"});
    });

    it("should return true if a object is not given", function () {
      var output = testSchema();

      expect(output.isValid).to.be(true);
      expect(output.data).to.be(undefined);
    });

    it("should set the name if it isn't defined", function () {
      var output = testSchema({});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("object").and.have.keys("name");
      expect(output.data.name).to.equal("Face");
    });
  });
});
