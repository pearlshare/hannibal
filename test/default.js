var expect = require("expect.js");
var Hannibal = require("../index");

describe("validator default", function () {
  var hannibal = new Hannibal();

  describe("default", function () {
    var testSchema = hannibal.create({
      default: "Face"
    });

    it("should be valid if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should set default if undefined", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Face");
    });

    it("should set default if null", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Face");
    });
  });

  describe("default with required", function () {
    var testSchema = hannibal.create({
      default: "Face",
      required: true
    });

    it("should not set default if value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
    });

    it("should set default if undefined", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Face");
    });

    it("should set default if null", function () {
      var output = testSchema(null);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Face");
    });
  });

  describe("default false", function () {
    var testSchema = hannibal.create({
      default: false
    });

    it("should not set default if a value is given", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql("Hannibal");
    });

    it("should set default if undefined", function () {
      var output = testSchema(undefined);

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql(false);
    });

    it("should set default if null", function () {
      var output = testSchema(null);

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

    it("should not set default if a value is given on the nested object", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.eql({name: "Hannibal"});
    });

    it("should not add nested object no nested object is given", function () {
      var output = testSchema();

      expect(output.isValid).to.be(true);
      expect(output.data).to.be(undefined);
    });

    it("should set the default on the nested object if it isn't defined", function () {
      var output = testSchema({});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("object").and.have.keys("name");
      expect(output.data.name).to.equal("Face");
    });
  });
});
