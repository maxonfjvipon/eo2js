const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const {data} = require('../../../runtime/data');
const bytesOf = require('../../../runtime/bytes-of');
const dataized = require('../../../runtime/dataized');

/**
 * Bytes.not.
 * @returns {object} - Bytes.not object
 */
const bytes$not = function() {
  const obj = object('bytes$not')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      bytesOf(dataized(self.take(RHO))).not().asBytes()
    )
  }
  return obj
}

module.exports = bytes$not
