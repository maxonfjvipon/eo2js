/**
 * Abstract error.
 */
class ErAbstract extends Error {
  /**
   * Ctor.
   * @param {string} message - Cause.
   */
  constructor(message) {
    super(message)
    this.name = 'ErAbstract'
  }
}

module.exports = ErAbstract
