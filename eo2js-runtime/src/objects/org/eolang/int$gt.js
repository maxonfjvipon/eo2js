const dataized = require('../../../runtime/dataized')
const object = require('../../../runtime/object')
const {data, INT} = require('../../../runtime/data')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials')
const at_void = require('../../../runtime/attribute/at-void')

/**
 * Int.gt.
 * @returns {any} - Int.gt object
 */
const int$gt = function() {
  const obj = object('int$gt')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      dataized(self.take(RHO), INT) > dataized(self.take('x'), INT)
    )
  }
  return obj
}

module.exports = int$gt
