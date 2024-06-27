const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const dataized = require('../../../runtime/dataized');
const {INT, data, STRING} = require('../../../runtime/data');
const ErFailure = require('../../../runtime/error/ErFailure');

/**
 * String.slice.
 * @returns {object} - String.slice object
 */
const string$slice = function() {
  const obj = object('string$slice')
  obj.attrs['start'] = at_void('start')
  obj.attrs['len'] = at_void('len')
  obj.assets[LAMBDA] = function(self) {
    const str = dataized(self.take(RHO), STRING)
    const start = dataized(self.take('start'), INT)
    const length = dataized(self.take('len'), INT)
    const end = length + start;
    if (start < 0) {
      throw new ErFailure(
        `Start index must be greater than 0 but was ${start}`,
      );
    }
    if (start > end) {
      throw new ErFailure(
        `End index must be greater or equal to start but was ${end} < ${start}`,
      );
    }
    if (end > str.length) {
      throw new ErFailure(
        `Start index + length must not exceed string length but was ${end} > ${str.length}`,
      );
    }
    return data.toObject(
      str.slice(Number(start), Number(end))
    )
  }
  return obj
}

module.exports = string$slice
