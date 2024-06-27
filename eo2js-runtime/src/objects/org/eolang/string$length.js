const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const {data, STRING} = require('../../../runtime/data');
const dataized = require('../../../runtime/dataized');

/**
 * String.length.
 * @returns {object} - String.length object
 */
const string$length = function() {
  const obj = object('string$length')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      BigInt(dataized(self.take(RHO), STRING).length)
    )
  }
  return obj
}

module.exports = string$length
