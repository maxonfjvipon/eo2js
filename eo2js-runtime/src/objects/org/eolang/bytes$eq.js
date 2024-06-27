const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const dataized = require('../../../runtime/dataized');
const {data} = require('../../../runtime/data');

/**
 * Bytes.eq.
 * @returns {object} - Bytes.eq object
 */
const bytes$eq = function() {
  const obj = object('bytes$eq')
  obj.attrs['b'] = at_void('b')
  obj.assets[LAMBDA] = function(self) {
    const rho = dataized(self.take(RHO))
    const arg = dataized(self.take('b'))
    return data.toObject(
      rho.length === arg.length &&
      rho.every((value, index) => arg[index] === value)
    )
  }
  return obj
}

module.exports = bytes$eq
