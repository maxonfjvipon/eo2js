const object = require('../../../../runtime/object')
const {LAMBDA} = require('../../../../runtime/attribute/specials');
const ErFailure = require('../../../../runtime/error/ErFailure');

/**
 * Stdin.φ.
 * @returns {object} - Stdin.φ object
 * @todo #3:30min Implement stdin$φ atom. We need to implement the atom and make sure it
 *  works. For the details of implementation check the Java analogue on
 *  https://github.com/objectionary/eo/tree/master/eo-runtime/src/main/java/EOorg/EOeolang
 */
const stdin$φ = function() {
  const obj = object('stdin$φ')
  obj.assets[LAMBDA] = function() {
    throw new ErFailure(
      `Atom stdin$φ is not implemented yet`
    )
  }
  return obj
}

module.exports = stdin$φ
