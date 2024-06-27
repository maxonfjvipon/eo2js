const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const {data, INT} = require('../../../runtime/data');
const heaps = require('../../../runtime/heaps');
const dataized = require('../../../runtime/dataized');

/**
 * Malloc.of.allocated.write.
 * @returns {object} - Malloc.of.allocated.write object
 */
const malloc$of$allocated$write = function() {
  const obj = object('malloc$of$allocated$write')
  obj.attrs['offset'] = at_void('offset')
  obj.attrs['data'] = at_void('data')
  obj.assets[LAMBDA] = function(self) {
    heaps.write(
      Number(dataized(self.take(RHO).take('id'), INT)),
      Number(dataized(self.take('offset'), INT)),
      dataized(self.take('data'))
    )
    return data.toObject(true)
  }
  return obj
}

module.exports = malloc$of$allocated$write
