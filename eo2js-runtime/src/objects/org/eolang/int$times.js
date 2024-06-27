const dataized = require('../../../runtime/dataized')
const object = require('../../../runtime/object')
const {data, INT} = require('../../../runtime/data')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials')
const at_void = require('../../../runtime/attribute/at-void')

/**
 * Int.times.
 * @returns {any} - Int.times object
 */
const int$times = function() {
  const obj = object('int$times')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      BigInt(dataized(self.take(RHO), INT) * dataized(self.take('x'), INT))
    )
  }
  return obj
}

module.exports = int$times
