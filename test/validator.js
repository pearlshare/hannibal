var expect = require("expect.js");
var Hannibal = require("../index");

describe("create", function () {
  var hannibal = new Hannibal();

  it("should take an object", function () {
    expect(hannibal.create.bind(hannibal)).withArgs({}).to.not.throwError();
  });

  it("should return a function", function () {
    expect(hannibal.create({})).to.be.a("function");
  });

  it("should throw an error if not an object", function () {
    expect(hannibal.create.bind(hannibal)).withArgs("should throw").to.throwError();
  });
});

describe("addValidators", function () {
  it("should add a set of validators", function () {
    var hannibal = new Hannibal();
    hannibal.addValidators({
      string: {
        isName: function (value, name) {
          if (value !== name) {
            throw new Error("is not " + name);
          }
        }
      }
    });

    var validator = hannibal.create({
      type: "string",
      validators: {
        isName: "Face"
      }
    });

    expect(validator("Face").isValid).to.be(true);
    expect(validator("BA").isValid).to.be(false);
  });
});
