const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const {data} = require('../../../runtime/data');
const dataized = require('../../../runtime/dataized');

/**
 * String.length.
 * @return {Object} - String.length object
 */
const string$length = function() {
  const obj = object('string$length')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      dataized(self.take(RHO), data.STRING).length
    )
  }
  return obj
}

module.exports = string$length
