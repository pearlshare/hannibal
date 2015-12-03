var assign   = require("lodash.assign");
var Hannibal = require("./lib/index");
var basic    = require("./lib/transforms/basic");

function HannibalWithTransforms(opts) {
  opts = opts || {};
  opts.transforms = assign({}, opts.transforms, basic);
  return Hannibal.call(this, opts);
}

HannibalWithTransforms.prototype = Object.create(Hannibal.prototype);

module.exports = HannibalWithTransforms;
