const once = require('./once');

/**
 * Object with applied bindings lazily.
 * @param {object} object - Object to apply bindings to
 * @param {object} bindings - Bindings to apply
 * @returns {object} - Object with applied bindings
 */
const applied = function(object, bindings) {
  return once(
    function() {
      return object.with(bindings)
    }
  )
}

module.exports = applied
