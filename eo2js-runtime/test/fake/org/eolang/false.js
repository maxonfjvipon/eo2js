/**
 * Fake FALSE EO object that is used for the test purposes.
 * Don't change the file until you definitely know what you're doing.
 * For more information please read README.md in test/fake folder
 * @returns {object} - Object
 */
const _false = function() {
  const object = require('../../../runtime/object')
  const attr = require('../../../runtime/attribute/attr')
  const phi = require('../../../runtime/phi')
  const {PHI, DELTA} = require('../../../runtime/attribute/specials')
  const obj = object('false')
  obj.attrs['as-bytes'] = attr.simple(
    phi.take('org.eolang.bytes').with({
      [DELTA]: [0]
    })
  )
  obj.attrs[PHI] = attr.once(attr.lambda(obj, (rho) => rho.take('as-bytes')))
  return obj
}

module.exports = _false
