const validated = require('../validated');
const safe = require('../safe');
const at_term = require('./at-term');

/**
 * Attribute that catches {@see ErFailure} and throws {@see ErError}.
 * @param {object} origin - Original attribute
 * @returns {object} - Attribute
 */
const at_safe = function(origin) {
  return at_term({
    put: function(object) {
      origin.put(object)
    },
    get: function() {
      return validated(() => safe(origin.get()))
    },
    copy: function(rho) {
      return at_safe(origin.copy(rho))
    }
  })
}

module.exports = at_safe
