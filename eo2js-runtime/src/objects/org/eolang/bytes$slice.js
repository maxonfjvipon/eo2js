const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const {data, INT} = require('../../../runtime/data');
const dataized = require('../../../runtime/dataized');

/**
 * Bytes.slice.
 * @returns {object} - Bytes.slice object
 */
const bytes$slice = function() {
  const obj = object('bytes$slice')
  obj.attrs['start'] = at_void('start')
  obj.attrs['len'] = at_void('len')
  obj.assets[LAMBDA] = function(self) {
    const start = dataized(self.take('start'), INT)
    return data.toObject(
      dataized(self.take(RHO)).slice(
        Number(start), Number(start + dataized(self.take('len'), INT))
      )
    )
  }
  return obj
}

module.exports = bytes$slice
