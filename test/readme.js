var assert = require("assert");
var readmeTester = require("readme-tester");
var path = require("path");

describe("README", function () {
  it("should pass", function(done) {
    readmeTester(path.resolve(__dirname, "../README.md"), function(err) {
      assert.ifError(err);
      done();
    });
  });
});
