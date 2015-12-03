var assign          = require("lodash.assign");
var Hannibal        = require("./lib/index");
var basicTransforms = require("./lib/transforms/basic");
var basicValidators = require("./lib/validators/basic");

function HannibalWithTransforms(opts) {
  Hannibal.call(this, opts);
  this.addTransforms(basicTransforms);
  this.addValidators(basicValidators);
}

HannibalWithTransforms.prototype = Object.create(Hannibal.prototype);

module.exports = HannibalWithTransforms;
