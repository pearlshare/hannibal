var expect = require("expect.js");
var hannibal = require("../index");

describe("builder", function () {
  it("should take an object", function () {
    expect(hannibal).withArgs({}).to.not.throwError();
  });

  it("should return a function", function () {
    expect(hannibal({})).to.be.a("function");
  });

  it("should throw an error if not an object", function () {
    expect(hannibal).withArgs("should throw").to.throwError();
  });

  it("should throw an error if the schema is invalid", function () {

  });
});
