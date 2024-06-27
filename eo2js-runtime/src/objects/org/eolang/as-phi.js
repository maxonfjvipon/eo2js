const object = require('../../../runtime/object')
const {LAMBDA} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const {data} = require('../../../runtime/data');

/**
 * As_phi.
 * @returns {object} - As_phi object
 */
const as_phi = function() {
  const obj = object('as_phi')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      self.take('x').φTerm()
    )
  }
  return obj
}

module.exports = as_phi
