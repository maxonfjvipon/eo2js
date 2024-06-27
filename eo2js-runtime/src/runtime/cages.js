const ErFailure = require('./error/ErFailure');

/**
 * Encaged objects.
 * @type {{}}
 */
const OBJECTS = {}

/**
 * Locators generator.
 * @type {number}
 */
let locator = 0

/**
 * Cages for objects
 * @type {{
 *  init: (object) => number,
 *  encage: (number, object) => void,
 *  get: (number) => object
 * }}
 */
const cages = {
  /**
   * Encage object for the first time.
   * New locator will be generated.
   * @param {number} object - Object to encage
   * @returns {number} - Locator
   */
  init: function(object) {
    const loc = ++locator
    if (!Object.hasOwn(OBJECTS, loc)) {
      OBJECTS[loc] = object
    }
    return loc
  },
  /**
   * Encage object to the storage by locator.
   * @param {number} loc - Locator
   * @param {object} object - object
   */
  encage: function(loc, object) {
    if (!Object.hasOwn(OBJECTS, loc)) {
      throw new ErFailure(
        `Encaged object with locator ${loc} was not initialized, can't reencage, can't encage`
      )
    }
    const current = OBJECTS[loc].forma()
    const forma = object.forma()
    if (current !== forma) {
      throw new ErFailure(
        `Can't encage an object formed by ${forma} because object formed by ${current} was encaged before`
      )
    }
    OBJECTS[loc] = object
  },
  /**
   * Retrieve object from storage by locator
   * @param {number} loc - Locator
   * @returns {object} - Object from storage
   */
  get: function(loc) {
    if (!Object.hasOwn(OBJECTS, loc)) {
      throw new ErFailure(
        `object with locator ${loc} is absent in cage, can't get`
      )
    }
    return OBJECTS[loc]
  }
}

module.exports = cages
