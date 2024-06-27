const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const {data, INT} = require('../../../runtime/data');
const bytesOf = require('../../../runtime/bytes-of');
const dataized = require('../../../runtime/dataized');

/**
 * Bytes.right.
 * @returns {object} - Bytes.right object
 */
const bytes$right = function() {
  const obj = object('bytes$right')
  obj.attrs['x'] = at_void('x')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      bytesOf(dataized(self.take(RHO)))
        .shift(dataized(self.take('x'), INT))
        .asBytes()
    )
  }
  return obj
}

module.exports = bytes$right
