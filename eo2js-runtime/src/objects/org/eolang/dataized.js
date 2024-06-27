const object = require('../../../runtime/object')
const dataized = require('../../../runtime/dataized')
const {LAMBDA} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const {data} = require('../../../runtime/data');

/**
 * Dataized.
 * @returns {object} - Dataized object
 */
const _dataized = function() {
  const obj = object('dataized')
  obj.attrs['target'] = at_void('target')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      dataized(self.take('target'))
    )
  }
  return obj
}

module.exports = _dataized
