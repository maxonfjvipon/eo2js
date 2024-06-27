const once = require('./once');

/**
 * Lazily taken attribute from the object.
 * @param {object} object - Object to take attribute from
 * @param {string} attribute - Attribute name to take
 * @returns {object} - Lazily taking attribute
 */
const taken = function(object, attribute) {
  return once(
    function() {
      return object.take(attribute)
    }
  )
}

module.exports = taken
