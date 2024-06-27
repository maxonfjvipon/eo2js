/**
 * Fake bytes EO object that is used for the test purposes.
 * Don't change the file until you definitely know what you're doing.
 * For more information please read README.md in test/fake folder
 * @returns {object} - Object
 */
const bytes = function() {
  const object = require('../../../runtime/object')

  return object('bytes')
}

module.exports = bytes
