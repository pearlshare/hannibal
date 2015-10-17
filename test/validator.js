var expect = require("expect.js");
var Hannibal = require("../index");

describe("create", function () {
  var hannibal = new Hannibal();

  it("should take an object", function () {
    expect(hannibal.create).withArgs({}).to.not.throwError();
  });

  it("should return a function", function () {
    expect(hannibal.create({})).to.be.a("function");
  });

  it("should throw an error if not an object", function () {
    expect(hannibal.create).withArgs("should throw").to.throwError();
  });

  it("should throw an error if the schema is invalid", function () {

  });
});
