var Hannibal        = require("./lib/index");
var basicTransforms = require("./transforms/basic");
var basicValidators = require("./validators/basic");

function HannibalWithTransforms(opts) {
  Hannibal.call(this, opts);
  this.addTransforms(basicTransforms);
  this.addValidators(basicValidators);
}

HannibalWithTransforms.prototype = Object.create(Hannibal.prototype);

module.exports = HannibalWithTransforms;
