const dataized = require('../../../runtime/dataized')
const object = require('../../../runtime/object')
const {data, FLOAT} = require('../../../runtime/data')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials')
const at_void = require('../../../runtime/attribute/at-void')

/**
 * Float.div.
 * @returns {any} - Float.div object
 */
const float$div = function() {
  const obj = object('float$div')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      dataized(self.take(RHO), FLOAT) / dataized(self.take('x'), FLOAT)
    )
  }
  return obj
}

module.exports = float$div
