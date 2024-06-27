const object = require('../../../../runtime/object')
const {LAMBDA} = require('../../../../runtime/attribute/specials');
const ErFailure = require('../../../../runtime/error/ErFailure');

/**
 * Stdin.next_line.
 * @returns {object} - Stdin.next_line object
 * @todo #3:30min Implement stdin$next_line atom. We need to implement the atom and make sure it
 *  works. For the details of implementation check the Java analogue on
 *  https://github.com/objectionary/eo/tree/master/eo-runtime/src/main/java/EOorg/EOeolang
 */
const stdin$next_line = function() {
  const obj = object('stdin$next_line')
  obj.assets[LAMBDA] = function() {
    throw new ErFailure(
      `Atom stdin$next_line is not implemented yet`
    )
  }
  return obj
}

module.exports = stdin$next_line
