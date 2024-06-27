/**
 * Attribute as φTerm.
 * @param {object} origin - Original attribute
 * @returns {object} - Attribute with default φTerm
 */
const at_term = function(origin) {
  return {
    ...origin,
    φTerm: function() {
      return origin.get().φTerm()
    }
  }
}

module.exports = at_term
