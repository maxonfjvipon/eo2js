/**
 * Second test.
 * @returns {object} object - Test object
 */
const second_test = function() {
  const object = require('eo2js-runtime/src/runtime/object')
  const {PHI, DELTA} = require('eo2js-runtime/src/runtime/attribute/specials')
  const attr = require('eo2js-runtime/src/runtime/attribute/attr')
  const obj = object('app')
  obj.attrs[PHI] = attr.lambda(
    obj, (_) => {
      const inner = object('inner')
      inner.assets[DELTA] = ['0x01']
      return inner
    }
  )
  return obj
}

it('test "second_test" should work', function() {
  const assert = require('assert')
  const dataized = require('eo2js-runtime/src/runtime/dataized')
  const {BOOL} = require('eo2js-runtime/src/runtime/data')
  assert.ok(dataized(second_test(), BOOL))
})
