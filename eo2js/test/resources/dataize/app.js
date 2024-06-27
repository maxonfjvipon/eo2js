/**
 * Object for testing dataization.
 * @returns {object} object - Test object
 */
const app = function() {
  const object = require('eo2js-runtime/src/runtime/object')
  const {PHI, DELTA} = require('eo2js-runtime/src/runtime/attribute/specials')
  const attr = require('eo2js-runtime/src/runtime/attribute/attr')
  const bytesOf = require('eo2js-runtime/src/runtime/bytes-of')
  const obj = object('app')
  obj.attrs[PHI] = attr.lambda(
    obj, (_) => {
      const inner = object('app$phi')
      inner.assets[DELTA] = bytesOf('Hello, world!').asBytes()
      return inner
    }
  )
  return obj
}

module.exports = app
