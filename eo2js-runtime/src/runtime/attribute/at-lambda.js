const ErFailure = require('../error/ErFailure');
const validated = require('../validated');
const {LAMBDA} = require('./specials');

/**
 * Lazy lambda attribute.
 * @param {object} object - Rho
 * @param {(self: object) => object} callback - Lambda to call
 * @returns {object} Lazy lambda attribute
 */
const at_lambda = function(object, callback) {
  return {
    put: function(_) {
      throw new ErFailure(`You can't override ${LAMBDA} expression in ${object.toString()}`)
    },
    get: function() {
      return validated(() => callback(object))
    },
    copy: function(rho) {
      return at_lambda(rho, callback)
    },
    φTerm: function() {
      return LAMBDA
    }
  }
}

module.exports = at_lambda
