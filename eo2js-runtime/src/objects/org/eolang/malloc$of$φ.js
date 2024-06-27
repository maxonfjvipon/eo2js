const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const dataized = require('../../../runtime/dataized');
const {INT, data} = require('../../../runtime/data');
const heaps = require('../../../runtime/heaps');

/**
 * Malloc.of.φ.
 * @returns {object} - Malloc.of.φ object
 */
const malloc$of$φ = function() {
  const obj = object('malloc$of$φ')
  obj.assets[LAMBDA] = function(self) {
    const rho = self.take(RHO);
    const size = Number(dataized(rho.take('size'), INT))
    const identifier = heaps.malloc(size)
    let res;
    try {
      dataized(
        rho.take('scope').with({
          0: rho.take('allocated').with({
            id: data.toObject(BigInt(identifier))
          })
        })
      )
      res = data.toObject(heaps.read(identifier, 0, size))
    } finally {
      heaps.free(identifier)
    }
    return res
  }
  return obj
}

module.exports = malloc$of$φ
