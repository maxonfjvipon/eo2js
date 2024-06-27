const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const {data} = require('../../../runtime/data');
const cages = require('../../../runtime/cages');

/**
 * Cage.φ.
 * @returns {object} - Cage.φ object
 */
const cage$φ = function() {
  const obj = object('cage$φ')
  obj.assets[LAMBDA] = function(self) {
    const rho = self.take(RHO)
    return rho.take('encaged').with({
      locator: data.toObject(
        BigInt(cages.init(rho.take('object')))
      )
    })
  }
  return obj
}

module.exports = cage$φ
