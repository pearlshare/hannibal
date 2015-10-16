var expect = require("expect.js");
var hannibal = require("../../index");

describe("pre", function () {

  describe("toString", function () {
    var testSchema = hannibal({
      type: "string",
      pre: "toString"
    });

    it("should turn a number into a string", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("1");
    });

    it("should turn a string into a string", function () {
      var output = testSchema("Hannibal");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("Hannibal");
    });

    it("should turn an array into a string", function () {
      var output = testSchema(["Hannibal", "Face"]);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("Hannibal,Face");
    });

    it("should turn an object into a string", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("string");
      expect(output.data).to.eql("[object Object]");
    });
  });

  describe("toInteger", function () {
    var testSchema = hannibal({
      type: "number",
      pre: "toInteger"
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

    it("should turn a string into an integer", function () {
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

  describe("toFloat", function () {
    var testSchema = hannibal({
      type: "number",
      pre: "toFloat"
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

    it("should turn a string into a float", function () {
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

    it("should turn an object into a string", function () {
      var output = testSchema({name: "Hannibal"});

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("number");
      expect(isNaN(output.data)).to.be(true);
    });
  });

  describe("toArray", function () {
    var testSchema = hannibal({
      type: "array",
      pre: "toArray"
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
