const object = require('../../../runtime/object')
const at_void = require('../../../runtime/attribute/at-void')
const {LAMBDA} = require('../../../runtime/attribute/specials');
const ErError = require('../../../runtime/error/ErError');

/**
 * Error.
 * You are NOT supposed to use this object programmatically. It is only
 * used from EO, but not from JS. From JS, you just throw
 * {@see ErFailure}. It will be properly caught and converted to the error.
 * Again, DON'T USE THIS OBJECT PROGRAMMATICALLY.
 * @returns {object} - Error object
 */
const error = function() {
  const obj = object('error')
  obj.attrs['message'] = at_void('message')
  obj.assets[LAMBDA] = function(self) {
    throw new ErError(
      self.take('message')
    )
  }
  return obj
}

module.exports = error
