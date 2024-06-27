/**
 * Attribute that caches result after get.
 * Resets cache on copying.
 * @param {object} origin - Original attribute
 * @returns {object} - Attribute
 */
const at_once = function(origin) {
  const cache = {
    object: null,
    term: null
  }
  return {
    put: function(object) {
      origin.put(object)
    },
    get: function() {
      if (cache.object === null) {
        cache.object = origin.get()
      }
      return cache.object
    },
    copy: function(rho) {
      return at_once(origin.copy(rho))
    },
    φTerm: function() {
      if (cache.term === null) {
        cache.term = origin.φTerm()
      }
      return cache.term
    }
  }
}

module.exports = at_once
