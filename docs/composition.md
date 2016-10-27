## Schema Composition

Schemas are objects which can be easily composed together for re-usability.

```js
var nameSchema = {
    type: "string",
    transforms: "toString"
};

var ageSchema = {
    type: "number",
    transforms: "toInteger"
};

var humanValidator = hannibal.create({
    name: nameSchema,
    age: ageSchema
});
```
