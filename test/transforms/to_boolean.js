var expect = require("expect.js");
var Hannibal = require("../../index");

describe("transforms", function () {
  var hannibal = new Hannibal();

  describe.only("toBoolean", function () {
    var testSchema = hannibal.create({
      type: "boolean",
      transforms: "toBoolean"
    });

    it("should turn 'on' into a true", function () {
      var output = testSchema("on");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should not validate 'bon/one'", function () {
      var output1 = testSchema("bon");
      expect(output1.isValid).to.be(false);

      var output2 = testSchema("one");
      expect(output2.isValid).to.be(false);
    });

    it("should turn 'yes' into a true", function () {
      var output = testSchema("yes");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should not validate 'nyes/yess'", function () {
      var output1 = testSchema("nyes");
      expect(output1.isValid).to.be(false);

      var output2 = testSchema("yess");
      expect(output2.isValid).to.be(false);
    });

    it("should turn 'true' into a true", function () {
      var output = testSchema("true");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should not validate 'ttrue/truee'", function () {
      var output1 = testSchema("ttrue");
      expect(output1.isValid).to.be(false);

      var output2 = testSchema("truee");
      expect(output2.isValid).to.be(false);
    });

    it("should turn 'off' into a true", function () {
      var output = testSchema("off");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });

    it("should not validate 'ooff/offf'", function () {
      var output1 = testSchema("ooff");
      expect(output1.isValid).to.be(false);

      var output2 = testSchema("offf");
      expect(output2.isValid).to.be(false);
    });

    it("should turn 'no' into a true", function () {
      var output = testSchema("no");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });

    it("should not validate 'nno/noo'", function () {
      var output1 = testSchema("nno");
      expect(output1.isValid).to.be(false);

      var output2 = testSchema("noo");
      expect(output2.isValid).to.be(false);
    });

    it("should turn 'false' into a true", function () {
      var output = testSchema("false");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });

    it("should not validate 'ffalse/falsee'", function () {
      var output1 = testSchema("ffalse");
      expect(output1.isValid).to.be(false);

      var output2 = testSchema("falsee");
      expect(output2.isValid).to.be(false);
    });

    /**
     * Number tests
     */
    it("should turn 1 into a true", function () {
      var output = testSchema(1);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should turn '1' into a true", function () {
      var output = testSchema('1');

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should turn 0 into a false", function () {
      var output = testSchema(0);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });

    it("should turn '0' into a false", function () {
      var output = testSchema(0);

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });
  });
});
