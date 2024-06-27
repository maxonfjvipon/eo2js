const object = require('../../../runtime/object')
const {LAMBDA, RHO} = require('../../../runtime/attribute/specials');
const dataized = require('../../../runtime/dataized');
const {INT} = require('../../../runtime/data');
const {traced} = require('../../../runtime/traced');
const cages = require('../../../runtime/cages');

/**
 * Cage.encaged.φ.
 * @returns {object} - Cage.encaged.φ object
 */
const cage$encaged$φ = function() {
  const obj = object('cage$encaged$φ')
  obj.assets[LAMBDA] = function(self) {
    const locator = Number(
      dataized(self.take(RHO).take('locator'), INT)
    )
    return traced(cages.get(locator), locator)
  }
  return obj
}

module.exports = cage$encaged$φ
