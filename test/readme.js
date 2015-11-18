var assert = require("assert");
var readmeTester = require("readme-tester");

describe("README", function () {
  it("should pass", function(done) {
    readmeTester(__dirname+"/../", function(err) {
      assert.ifError(err);
      done();
    });
  })
});
