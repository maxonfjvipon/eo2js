const {RHO} = require('./attribute/specials');
const at_rho = require('./attribute/at-rho');

/**
 * Set rho attribute to the object if it does not have one.
 * @param {object} object - Object to set rho attribute to
 * @param {object} rho - Rho object
 * @param {string} name - Name of the object as attribute
 * @returns {object} The same object if it already has rho attribute or new copy of the object with injected rho
 */
const with_rho = function(object, rho, name) {
  let obj = object
  if (name !== RHO && !Object.hasOwn(object.attrs, RHO)) {
    obj = obj.copy()
    obj.attrs[RHO] = at_rho(rho)
  }
  return obj
}

module.exports = with_rho
