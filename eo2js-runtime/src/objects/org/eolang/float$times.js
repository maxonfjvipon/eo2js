const dataized = require('../../../runtime/dataized')
const object = require('../../../runtime/object')
const {data, FLOAT} = require('../../../runtime/data')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials')
const at_void = require('../../../runtime/attribute/at-void')

/**
 * Float.times.
 * @returns {any} - Float.times object
 */
const float$times = function() {
  const obj = object('float$times')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      dataized(self.take(RHO), FLOAT) * dataized(self.take('x'), FLOAT)
    )
  }
  return obj
}

module.exports = float$times
