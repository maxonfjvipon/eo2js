const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const {data} = require('../../../runtime/data');
const dataized = require('../../../runtime/dataized');

/**
 * Bytes.size.
 * @returns {object} - Bytes.size object
 */
const bytes$size = function() {
  const obj = object('bytes$size')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      BigInt(dataized(self.take(RHO)).length)
    )
  }
  return obj
}

module.exports = bytes$size
