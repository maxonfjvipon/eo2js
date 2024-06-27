/**
 * Fake CAGE EO object that is used for the test purposes.
 * Don't change the file until you definitely know what you're doing.
 * For more information please read README.md in test/fake folder
 * @returns {object} - Object
 */
const cage = function() {
  const object = require('../../../runtime/object')
  const attr = require('../../../runtime/attribute/attr')
  const taken = require('../../../runtime/taken')
  const cage$φ = require('../../../objects/org/eolang/cage$φ')
  const obj = object('cage')
  obj.attrs['object'] = attr.void('object')
  obj.attrs['new'] = attr.once(
    attr.lambda(
      obj, function(rho) {
        return taken(taken(rho, 'φ'), 'self')
      }
    )
  )
  obj.attrs['φ'] = attr.once(
    attr.lambda(
      obj, function(rho) {
        return cage$φ(rho)
      }
    )
  )
  obj.attrs['encaged'] = attr.once(
    attr.lambda(
      obj, function(rho) {
        return cage$encaged(rho)
      }
    )
  )
  return obj
}

/**
 * Fake CAGE.ENCAGED EO object that is used for the test purposes.
 * Don't change the file until you definitely know what you're doing.
 * For more information please read README.md in test/fake folder
 * @returns {object} - Object
 */
const cage$encaged = function() {
  const object = require('../../../runtime/object')
  const attr = require('../../../runtime/attribute/attr')
  const cage$encaged$φ = require('../../../objects/org/eolang/cage$encaged$φ')
  const cage$encaged$encage = require('../../../objects/org/eolang/cage$encaged$encage')
  const obj = object('cage$encaged')
  obj.attrs['locator'] = attr.void('locator')
  obj.attrs['self'] = attr.once(
    attr.lambda(
      obj, function(rho) {
        return rho
      }
    )
  )
  obj.attrs['φ'] = attr.once(
    attr.lambda(
      obj, function(rho) {
        return cage$encaged$φ(rho)
      }
    )
  )
  obj.attrs['encage'] = attr.once(
    attr.lambda(
      obj, function(rho) {
        return cage$encaged$encage(rho)
      }
    )
  )
  return obj
}

module.exports = cage
