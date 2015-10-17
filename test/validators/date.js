var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validators.date", function () {
  var hannibal = new Hannibal();

  describe("min Value", function () {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    var testSchema = hannibal.create({
      type: "date",
      validators: {
        min: yesterday
      }
    });

    it("should validate if bigger", function () {
      var output = testSchema(new Date());

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if smaller", function () {
      var twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      var output = testSchema(twoDaysAgo);

      expect(output.isValid).to.be(false);
    });
  });

  describe("max Value", function () {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    var testSchema = hannibal.create({
      type: "date",
      validators: {
        max: tomorrow
      }
    });

    it("should validate if smallers", function () {
      var output = testSchema(new Date());

      expect(output.isValid).to.be(true);
    });

    it("should fail to validate if bigger", function () {
      var twoDaysTime = new Date();
      twoDaysTime.setDate(twoDaysTime.getDate() + 2);
      var output = testSchema(twoDaysTime);

      expect(output.isValid).to.be(false);
    });
  });
});
