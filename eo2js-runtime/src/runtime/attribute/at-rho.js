const ErFailure = require('../error/ErFailure');
const {RHO} = require('./specials');
const at_term = require('./at-term');

/**
 * Attribute that keeps \rho.
 * @param {object} [object] - Rho object
 * @returns {object} - Rho attribute
 */
const at_rho = function(object = null) {
  let rho = object
  return at_term({
    put: function(obj) {
      if (rho == null) {
        rho = obj
      }
    },
    get: function() {
      if (rho === null) {
        throw new ErFailure(`Attribute ${RHO} is not set, can't #get()`)
      }
      return rho
    },
    copy: function(_) {
      return at_rho(rho)
    }
  })
}

module.exports = at_rho
