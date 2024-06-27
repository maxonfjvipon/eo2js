const dataized = require('../../../runtime/dataized')
const object = require('../../../runtime/object')
const {data, INT} = require('../../../runtime/data')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials')
const at_void = require('../../../runtime/attribute/at-void')
const ErFailure = require('../../../runtime/error/ErFailure');

/**
 * Int.div.
 * @returns {any} - Int.div object
 */
const int$div = function() {
  const obj = object('int$div')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    const arg = dataized(self.take('x'), INT)
    if (arg === BigInt(0)) {
      throw new ErFailure(`Can't divide ${arg} by zero`)
    }
    return data.toObject(
      BigInt(dataized(self.take(RHO), INT) / arg)
    )
  }
  return obj
}

module.exports = int$div
