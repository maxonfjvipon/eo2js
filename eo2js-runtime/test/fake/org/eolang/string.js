/**
 * Fake string EO object that is used for the test purposes.
 * Don't change the file until you definitely know what you're doing.
 * For more information please read README.md in test/fake folder
 * @returns {object} - Object
 */
const string = function() {
  const object = require('../../../runtime/object')
  const attr = require('../../../runtime/attribute/attr')
  const {PHI} = require('../../../runtime/attribute/specials')
  const obj = object('string')
  obj.attrs['as-bytes'] = attr.void('as-bytes')
  obj.attrs[PHI] = attr.once(attr.lambda(obj, (rho) => rho.take('as-bytes')))
  return obj
}

module.exports = string
