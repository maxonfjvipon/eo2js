const ErFailure = require('../error/ErFailure');
const {EMPTY} = require('./specials');

/**
 * Void attribute.
 * @param {string} name - Name of the attribute
 * @param {object} object - Object
 * @returns {object} - Free attribute
 */
const at_void = function(name, object = null) {
  let obj = object
  return {
    put: function(object) {
      if (obj != null) {
        throw new ErFailure(`Void attribute '${name}' is already set, can't reset`)
      }
      obj = object
    },
    get: function() {
      if (obj == null) {
        throw new ErFailure(`Void attribute '${name}' is not set, can't take`)
      }
      return obj
    },
    copy: function(_) {
      return at_void(name, obj)
    },
    φTerm: function() {
      let term
      if (obj === null) {
        term = EMPTY
      } else {
        term = obj.φTerm()
      }
      return term
    }
  }
}

module.exports = at_void
