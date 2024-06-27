const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const dataized = require('../../../runtime/dataized');
const {INT, data} = require('../../../runtime/data');
const heaps = require('../../../runtime/heaps');

/**
 * Malloc.of.allocated.read.
 * @returns {object} - Malloc.of.allocated.read object
 */
const malloc$of$allocated$read = function() {
  const obj = object('malloc$of$allocated$read')
  obj.attrs['offset'] = at_void('offset')
  obj.attrs['length'] = at_void('length')
  obj.assets[LAMBDA] = function(self) {
    return data.toObject(
      heaps.read(
        Number(dataized(self.take(RHO).take('id'), INT)),
        Number(dataized(self.take('offset'), INT)),
        Number(dataized(self.take('length'), INT))
      )
    )
  }
  return obj
}

module.exports = malloc$of$allocated$read
