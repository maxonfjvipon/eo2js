const trapped = require('./trapped');
const ErFailure = require('./error/ErFailure');

/**
 * Max possible depth of cage recursion
 * @type {number}
 * @todo #61:30min Find a way to set this parameter dynamically via command line options. This
 *  parameter is used to limit cage self recursion. It would be better to be able to set it via
 *  command line options and environment variables.
 */
const RECURSION_THRESHOLD = 100

/**
 * Cages that are currently being dataized. If one cage is being datazed, and
 * it needs to be dataized inside current dataization, the locator of current object be here.
 * @type {{}}
 */
const DATAIZING_CAGES = {}

/**
 * Increment counter of cage in the {@link DATAIZING_CAGES}.
 * @param {number} locator - Locator of the cage
 * @param {number} depth - Depth of cage recursion
 */
const increment = function(locator, depth) {
  if (!Object.hasOwn(DATAIZING_CAGES, locator)) {
    DATAIZING_CAGES[locator] = 1
  } else {
    DATAIZING_CAGES[locator] = DATAIZING_CAGES[locator] + 1
  }
  if (DATAIZING_CAGES[locator] > depth) {
    throw new ErFailure(
      `The cage with locator ${locator} has reached the maximum nesting depth = ${depth}`
    )
  }
}

/**
 * Decrement counter of cage in the {@link DATAIZING_CAGES}.
 * @param {number} locator - Locator of the cage
 */
const decrement = function(locator) {
  if (Object.hasOwn(DATAIZING_CAGES, locator)) {
    const count = DATAIZING_CAGES[locator] - 1
    if (count === 0) {
      delete DATAIZING_CAGES[locator]
    } else {
      DATAIZING_CAGES[locator] = count
    }
  }
}

/**
 * Object that traces if the "cage.new" got into recursion during the dataization.
 * @param {object} object - Encaged object
 * @param {number} locator - Locator of the object
 * @param {number} depth - Max depth of cage recursion
 * @returns {object} - Traced object
 */
const traced = function(object, locator, depth = RECURSION_THRESHOLD) {
  return trapped(
    object,
    function(_, target, thisArg, args) {
      increment(locator, depth)
      const ret = target.call(thisArg, ...args)
      decrement(locator)
      return ret
    }
  )
}

module.exports = {
  traced,
  RECURSION_THRESHOLD
}
