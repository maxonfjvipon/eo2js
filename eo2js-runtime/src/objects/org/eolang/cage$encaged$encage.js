const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const at_void = require('../../../runtime/attribute/at-void');
const cages = require('../../../runtime/cages');
const dataized = require('../../../runtime/dataized');
const {INT, data} = require('../../../runtime/data');

/**
 * Cage.encaged.encage.
 * @returns {object} - Cage.encaged.encage object
 */
const cage$encaged$encage = function() {
  const obj = object('cage$encaged$encage')
  obj.attrs['object'] = at_void('object')
  obj.assets[LAMBDA] = function(self) {
    cages.encage(
      Number(dataized(self.take(RHO).take('locator'), INT)),
      self.take('object')
    );
    return data.toObject(true)
  }
  return obj
}

module.exports = cage$encaged$encage
