const at_lambda = require('./at-lambda');
const at_once = require('./at-once');

/**
 * Simple attribute.
 * @param {object} object - Object ot return
 * @returns {object} - Simple attribute
 */
const at_simple = function(object) {
  return at_once(
    at_lambda(
      this, (_) => object
    )
  )
}

module.exports = at_simple
