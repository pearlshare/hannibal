## Lite mode

A lite version of Hannibal is available, designed for use on clients. This does not include any validators or transforms by default. The following is the same as the normal hannibal.

```js
var HannibalLite = require("hannibal/lite");
var liteHannibal = new HannibalLite();

// Add in basic validators
liteHannibal.addTransforms(require("hannibal/transforms/basic"));
liteHannibal.addValidators(require("hannibal/validators/basic"));

// Use liteHannibal
```
