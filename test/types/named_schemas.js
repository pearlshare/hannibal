var expect = require("expect.js");
var Hannibal = require("../../index");

describe("validator referenced schemas", function () {
  var hannibal = new Hannibal();

  describe("parsing referenced schemas", function () {

    it("should accept a valid object schema", function () {
      expect(hannibal.create.bind(hannibal)).withArgs({
        id: "main",
        type: "object",
        schema: {
          one: {
            type: "string"
          },
          two: {
            type: "string"
          },
          recurse: {
            ref: "main"
          }
        }
      }).to.not.throwError();
    });

    it("should accept a valid array schema", function () {
      expect(hannibal.create.bind(hannibal)).withArgs({
        id: "main",
        type: "object",
        schema: {
          one: {
            type: "string"
          },
          two: {
            type: "string"
          },
          recurse: {
            type: "array",
            schema: {
              ref: "main"
            }
          }
        }
      }).to.not.throwError();
    });

    it("should throw with an invalid object schema", function () {
      expect(hannibal.create.bind(hannibal)).withArgs({
        id: "main",
        type: "object",
        schema: {
          one: {
            id: "main", // Duplicate named schema
            type: "string"
          },
          two: {
            type: "string"
          },
          recurse: {
            ref: "main"
          }
        }
      }).to.throwError(function (err) {
        console.log(err)
      });
    });

    it("should throw with an invalid array schema", function () {
      expect(hannibal.create.bind(hannibal)).withArgs({
        id: "main",
        type: "object",
        schema: {
          one: {
            type: "string"
          },
          two: {
            type: "string"
          },
          recurse: {
            type: "array",
            id: "main",
            schema: {
              ref: "main"
            }
          }
        }
      }).to.throwError();
    });

    it("should throw with an invalid deeply nested schema", function () {
      expect(hannibal.create.bind(hannibal)).withArgs({
        id: "main",
        type: "object",
        schema: {
          one: {
            type: "string"
          },
          two: {
            type: "string"
          },
          three: {
            type: "array",
            schema: {
              type: "object",
              id: "main"
            }
          }
        }
      }).to.throwError();
    });

  });

  describe("referenced object schemas", function () {
    var testSchema = hannibal.create({
      id: "main",
      type: "object",
      schema: {
        one: {
          type: "string",
          required: true
        },
        two: {
          type: "string",
          required: true
        },
        recurse: {
          ref: "main"
        }
      }
    });

    it("should validate a basic object", function () {
      var output = testSchema({
        one: "one",
        two: "two",
        recurse: {
          one: "one",
          two: "two"
        }
      });

      expect(output.isValid).to.be(true);
    });

    it("should validate a nested object", function () {
      var output = testSchema({
        one: "one",
        two: "two",
        recurse: {
          one: "one",
          two: "two",
          recurse: {
            one: "one",
            two: "two",
            recurse: {
              one: "one",
              two: "two"
            }
          }
        }
      });

      expect(output.isValid).to.be(true);
      expect(output.data.one).to.equal("one");
      expect(output.data.recurse.one).to.equal("one");
      expect(output.data.recurse.recurse.one).to.equal("one");
      expect(output.data.recurse.recurse.recurse.one).to.equal("one");
    });

    it("should validate a basic object and find invalid content at the top level", function () {
      var output = testSchema({
        one: 1,
        two: "two",
        recurse: {
          one: "one",
          two: "two"
        }
      });

      expect(output.isValid).to.be(false);
      expect(output.error.one).to.be.an("object").and.have.keys("type");
    });

    it("should validate a basic object and find invalid content at the nested level", function () {
      var output = testSchema({
        one: "one",
        two: "two",
        recurse: {
          one: 1,
          two: "two"
        }
      });

      expect(output.isValid).to.be(false);
      expect(output.error.recurse.one).to.be.an("object").and.have.keys("type");
    });
  });

  describe("referenced array schemas", function () {
    var testSchema = hannibal.create({
      id: "main",
      type: "array",
      schema: {
        type: "object",
        schema: {
          one: {
            type: "string",
            required: true
          },
          two: {
            type: "string",
            required: true
          },
          recurse: {
            ref: "main"
          }
        }
      }
    });

    it("should validate a basic object", function () {
      var output = testSchema([
        {
          one: "one",
          two: "two",
          recurse: [
            {
              one: "one",
              two: "two"
            }
          ]
        }
      ]);

      expect(output.isValid).to.be(true);
    });

    it("should validate a nested object", function () {
      var output = testSchema([
        {
          one: "one",
          two: "two",
          recurse: [
            {
              one: "one",
              two: "two",
              recurse: [
                {
                  one: "one",
                  two: "two",
                  recurse: [
                    {
                      one: "one",
                      two: "two"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]);

      expect(output.isValid).to.be(true);
      expect(output.data[0].one).to.equal("one");
      expect(output.data[0].recurse[0].one).to.equal("one");
      expect(output.data[0].recurse[0].recurse[0].one).to.equal("one");
      expect(output.data[0].recurse[0].recurse[0].recurse[0].one).to.equal("one");
    });

    it("should validate a basic object and find invalid content at the top level", function () {
      var output = testSchema(
        [
          {
          one: 1,
          two: "two",
          recurse: [
            {
              one: "one",
              two: "two"
            }
          ]
        }
      ]);

      expect(output.isValid).to.be(false);
      expect(output.error[0].one).to.be.an("object").and.have.keys("type");
    });

    it("should validate a basic object and find invalid content at the nested level", function () {
      var output = testSchema(
        [
          {
          one: "one",
          two: "two",
          recurse: [
            {
              one: 1,
              two: "two"
            }
          ]
        }
      ]);

      expect(output.isValid).to.be(false);
      expect(output.error[0].recurse[0].one).to.be.an("object").and.have.keys("type");
    });
  });
});
