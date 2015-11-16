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

    it("should turn 'yes' into a true", function () {
      var output = testSchema("yes");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should turn 'true' into a true", function () {
      var output = testSchema("true");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(true);
    });

    it("should turn 'off' into a true", function () {
      var output = testSchema("off");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });

    it("should turn 'no' into a true", function () {
      var output = testSchema("no");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });

    it("should turn 'false' into a true", function () {
      var output = testSchema("false");

      expect(output.isValid).to.be(true);
      expect(output.data).to.be.a("boolean");
      expect(output.data).to.eql(false);
    });
  });
});
