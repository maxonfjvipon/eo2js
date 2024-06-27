const object = require('../../../runtime/object')
const {LAMBDA} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const dataized = require('../../../runtime/dataized');
const {INT, data} = require('../../../runtime/data');
const taken = require('../../../runtime/taken');

/**
 * Extract element from EO tuple and convert them to JS array.
 * @param {object} tuple - EO tuple object
 * @returns {object[]} - Array of EO tuple elements.
 */
const tupleAsArray = function(tuple) {
  const length = Number(dataized(tuple.take('length'), INT))
  const res = Array(length)
  let external = tuple
  for (let idx = length - 1; idx >= 0; --idx) {
    res[idx] = taken(external, 'tail')
    external = external.take('head')
  }
  return res
}

/**
 * Seq.
 * @returns {object} - Seq object
 */
const seq = function() {
  const obj = object('seq')
  obj.attrs['steps'] = at_void('steps')
  obj.assets[LAMBDA] = function(self) {
    const steps = self.take('steps');
    const items = tupleAsArray(steps);
    for (let idx = 0; idx < items.length - 1; ++idx) {
      dataized(items[idx])
    }
    let ret
    if (items.length > 0) {
      ret = taken(steps, 'tail')
    } else {
      ret = data.toObject(false)
    }
    return ret
  }
  return obj
}

module.exports = seq
