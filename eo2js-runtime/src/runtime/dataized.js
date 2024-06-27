const {INT, FLOAT, BOOL, BYTES, STRING} = require('./data')
const bytesOf = require('./bytes-of');
const ErFailure = require('./error/ErFailure');

/**
 * Dataized.
 * @param {object} object - Object to dataize
 * @param {string} [type] - Type to cast to
 * @returns {string|number|bigint|boolean|Array.<number>} - Data
 */
const dataized = function(object, type) {
  const bytes = bytesOf(object.data())
  type = type || BYTES
  let data
  if (type === INT) {
    data = bytes.asInt()
  } else if (type === FLOAT) {
    data = bytes.asFloat()
  } else if (type === BOOL) {
    data = bytes.asBool()
  } else if (type === STRING) {
    data = bytes.asString()
  } else if (type === BYTES) {
    data = bytes.asBytes()
  } else {
    throw new ErFailure(`Can't dataize to the given type (${type}), 
    only ${INT}, ${FLOAT}, ${BOOL}, ${STRING}, ${BYTES} are allowed`)
  }
  return data
}

module.exports = dataized
