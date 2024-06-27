const validated = require('./validated');
const trapped = require('./trapped');

/**
 * Object that catches {@see ErFailure} and
 * throws {@see ErError} in its 'take' and 'with' methods.
 * @param {object} origin - Original object
 * @returns {object} - Safe object
 */
const safe = function(origin) {
  return trapped(
    origin,
    function(_, target, thisArg, args) {
      return validated(() => target.call(origin, ...args))
    }
  )
}

module.exports = safe
