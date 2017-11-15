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

// ReadmeTester only runs for files named README.md :(
// ["composition.md", "customisation.md", "full_example.md", "lite.md", "writing_transformations.md"].forEach(function (file) {
//   describe("docs/" + file, function () {
//     it("should pass", function(done) {
//       readmeTester(path.resolve(__dirname, "../docs", file), function(err) {
//         assert.ifError(err);
//         done();
//       });
//     });
//   });
// });
