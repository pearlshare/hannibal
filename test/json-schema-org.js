const assert = require("assert");
const Hannibal = require('../')

/**
 * NOTE: These are verbose on purpose as its easier to comment out drafts/suites when developing
 */
const jsonSchemaOrgSuites = {
  'draft3': [].concat(
    require('json-schema-test-suite/tests/draft3/additionalItems.json'),
    require('json-schema-test-suite/tests/draft3/additionalProperties.json'),
    require('json-schema-test-suite/tests/draft3/default.json'),
    require('json-schema-test-suite/tests/draft3/dependencies.json'),
    require('json-schema-test-suite/tests/draft3/disallow.json'),
    require('json-schema-test-suite/tests/draft3/divisibleBy.json'),
    require('json-schema-test-suite/tests/draft3/enum.json'),
    require('json-schema-test-suite/tests/draft3/extends.json'),
    require('json-schema-test-suite/tests/draft3/items.json'),
    require('json-schema-test-suite/tests/draft3/maxItems.json'),
    require('json-schema-test-suite/tests/draft3/maxLength.json'),
    require('json-schema-test-suite/tests/draft3/maximum.json'),
    require('json-schema-test-suite/tests/draft3/minItems.json'),
    require('json-schema-test-suite/tests/draft3/minLength.json'),
    require('json-schema-test-suite/tests/draft3/minimum.json'),
    require('json-schema-test-suite/tests/draft3/pattern.json'),
    require('json-schema-test-suite/tests/draft3/patternProperties.json'),
    require('json-schema-test-suite/tests/draft3/properties.json'),
    require('json-schema-test-suite/tests/draft3/ref.json'),
    require('json-schema-test-suite/tests/draft3/refRemote.json'),
    require('json-schema-test-suite/tests/draft3/required.json'),
    require('json-schema-test-suite/tests/draft3/type.json'),
    require('json-schema-test-suite/tests/draft3/uniqueItems.json'),
  ),
  'draft4': [].concat(
    require('json-schema-test-suite/tests/draft4/additionalItems.json'),
    require('json-schema-test-suite/tests/draft4/additionalProperties.json'),
    require('json-schema-test-suite/tests/draft4/allOf.json'),
    require('json-schema-test-suite/tests/draft4/anyOf.json'),
    require('json-schema-test-suite/tests/draft4/default.json'),
    require('json-schema-test-suite/tests/draft4/definitions.json'),
    require('json-schema-test-suite/tests/draft4/dependencies.json'),
    require('json-schema-test-suite/tests/draft4/enum.json'),
    require('json-schema-test-suite/tests/draft4/items.json'),
    require('json-schema-test-suite/tests/draft4/maxItems.json'),
    require('json-schema-test-suite/tests/draft4/maxLength.json'),
    require('json-schema-test-suite/tests/draft4/maxProperties.json'),
    require('json-schema-test-suite/tests/draft4/maximum.json'),
    require('json-schema-test-suite/tests/draft4/minItems.json'),
    require('json-schema-test-suite/tests/draft4/minLength.json'),
    require('json-schema-test-suite/tests/draft4/minProperties.json'),
    require('json-schema-test-suite/tests/draft4/minimum.json'),
    require('json-schema-test-suite/tests/draft4/multipleOf.json'),
    require('json-schema-test-suite/tests/draft4/not.json'),
    require('json-schema-test-suite/tests/draft4/oneOf.json'),
    require('json-schema-test-suite/tests/draft4/pattern.json'),
    require('json-schema-test-suite/tests/draft4/patternProperties.json'),
    require('json-schema-test-suite/tests/draft4/properties.json'),
    require('json-schema-test-suite/tests/draft4/ref.json'),
    require('json-schema-test-suite/tests/draft4/refRemote.json'),
    require('json-schema-test-suite/tests/draft4/required.json'),
    require('json-schema-test-suite/tests/draft4/type.json'),
    require('json-schema-test-suite/tests/draft4/uniqueItems.json'),
  ),
  'draft6': [].concat(
    require('json-schema-test-suite/tests/draft6/additionalItems.json'),
    require('json-schema-test-suite/tests/draft6/additionalProperties.json'),
    require('json-schema-test-suite/tests/draft6/allOf.json'),
    require('json-schema-test-suite/tests/draft6/anyOf.json'),
    require('json-schema-test-suite/tests/draft6/boolean_schema.json'),
    require('json-schema-test-suite/tests/draft6/const.json'),
    require('json-schema-test-suite/tests/draft6/contains.json'),
    require('json-schema-test-suite/tests/draft6/default.json'),
    require('json-schema-test-suite/tests/draft6/definitions.json'),
    require('json-schema-test-suite/tests/draft6/dependencies.json'),
    require('json-schema-test-suite/tests/draft6/enum.json'),
    require('json-schema-test-suite/tests/draft6/exclusiveMaximum.json'),
    require('json-schema-test-suite/tests/draft6/exclusiveMinimum.json'),
    require('json-schema-test-suite/tests/draft6/items.json'),
    require('json-schema-test-suite/tests/draft6/maxItems.json'),
    require('json-schema-test-suite/tests/draft6/maxLength.json'),
    require('json-schema-test-suite/tests/draft6/maxProperties.json'),
    require('json-schema-test-suite/tests/draft6/maximum.json'),
    require('json-schema-test-suite/tests/draft6/minItems.json'),
    require('json-schema-test-suite/tests/draft6/minLength.json'),
    require('json-schema-test-suite/tests/draft6/minProperties.json'),
    require('json-schema-test-suite/tests/draft6/minimum.json'),
    require('json-schema-test-suite/tests/draft6/multipleOf.json'),
    require('json-schema-test-suite/tests/draft6/not.json'),
    require('json-schema-test-suite/tests/draft6/oneOf.json'),
    require('json-schema-test-suite/tests/draft6/pattern.json'),
    require('json-schema-test-suite/tests/draft6/patternProperties.json'),
    require('json-schema-test-suite/tests/draft6/properties.json'),
    require('json-schema-test-suite/tests/draft6/propertyNames.json'),
    require('json-schema-test-suite/tests/draft6/ref.json'),
    require('json-schema-test-suite/tests/draft6/refRemote.json'),
    require('json-schema-test-suite/tests/draft6/required.json'),
    require('json-schema-test-suite/tests/draft6/type.json'),
    require('json-schema-test-suite/tests/draft6/uniqueItems.json'),
  ),
  'draft7': [].concat(
    // require('json-schema-test-suite/tests/draft7/additionalItems.json'),
    // require('json-schema-test-suite/tests/draft7/additionalProperties.json'),
    // require('json-schema-test-suite/tests/draft7/allOf.json'),
    // require('json-schema-test-suite/tests/draft7/anyOf.json'),
    // require('json-schema-test-suite/tests/draft7/boolean_schema.json'),
    // require('json-schema-test-suite/tests/draft7/const.json'),
    // require('json-schema-test-suite/tests/draft7/contains.json'),
    require('json-schema-test-suite/tests/draft7/default.json'),
    // require('json-schema-test-suite/tests/draft7/definitions.json'),
    // require('json-schema-test-suite/tests/draft7/dependencies.json'),
    require('json-schema-test-suite/tests/draft7/enum.json'),
    require('json-schema-test-suite/tests/draft7/exclusiveMaximum.json'),
    require('json-schema-test-suite/tests/draft7/exclusiveMinimum.json'),
    // require('json-schema-test-suite/tests/draft7/if-then-else.json'),
    // require('json-schema-test-suite/tests/draft7/items.json'),
    require('json-schema-test-suite/tests/draft7/maxItems.json'),
    require('json-schema-test-suite/tests/draft7/maxLength.json'),
    // require('json-schema-test-suite/tests/draft7/maxProperties.json'),
    require('json-schema-test-suite/tests/draft7/maximum.json'),
    require('json-schema-test-suite/tests/draft7/minItems.json'),
    require('json-schema-test-suite/tests/draft7/minLength.json'),
    // require('json-schema-test-suite/tests/draft7/minProperties.json'),
    require('json-schema-test-suite/tests/draft7/minimum.json'),
    // require('json-schema-test-suite/tests/draft7/multipleOf.json'),
    // require('json-schema-test-suite/tests/draft7/not.json'),
    // require('json-schema-test-suite/tests/draft7/oneOf.json'),
    require('json-schema-test-suite/tests/draft7/pattern.json'),
    // require('json-schema-test-suite/tests/draft7/patternProperties.json'),
    require('json-schema-test-suite/tests/draft7/properties.json'),
    // require('json-schema-test-suite/tests/draft7/propertyNames.json'),
    // require('json-schema-test-suite/tests/draft7/ref.json'),
    // require('json-schema-test-suite/tests/draft7/refRemote.json'),
    // require('json-schema-test-suite/tests/draft7/required.json'),
    require('json-schema-test-suite/tests/draft7/type.json'),
    require('json-schema-test-suite/tests/draft7/uniqueItems.json'),
  )
};

const suites = [].concat(
  // jsonSchemaOrgSuites.draft3,
  // jsonSchemaOrgSuites.draft4,
  // jsonSchemaOrgSuites.draft6,
  jsonSchemaOrgSuites.draft7,
);


describe("json-schema-org", () => {
  suites.forEach((suite)=> {
    describe(suite.description, () => {
      suite.tests.forEach((test) => {
        it(test.description, function() {
          const hannibal = new Hannibal()
          const validator = hannibal.create(suite.schema);

          const rslt = validator(test.data, {
            jsonSchemaMode: true
          })
          if(rslt.isValid !== test.valid) {
            if(process.env.TEST_DEBUG === "true") {
              console.log(rslt)
              console.log(suite.schema)
              console.log(test.data)
            }
          }
          assert.equal(rslt.isValid, test.valid);
        })
      })
    })
  })
})
