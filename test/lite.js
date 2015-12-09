var expect = require("expect.js");
var Hannibal = require("../lite");

describe("lite version", function () {
  var hannibal = new Hannibal();

  describe("shouldn't contain transforms", function () {

    [
      "uniq",
      "compact",
      "toString",
      "toInteger",
      "toFloat",
      "toArray",
      "toDate",
      "toBoolean",
      "capitalize",
      "deburr",
      "escape",
      "kebabCase",
      "toLowerCase",
      "trim",
      "toUpperCase",
      "words"
    ].forEach(function(method) {
      it(method, function () {
        var testSchema = hannibal.create({transforms: method});
        expect(function() {
          testSchema({});
        }).to.throwException("no transforms registered called: " + method);
      });
    });

  });

});
