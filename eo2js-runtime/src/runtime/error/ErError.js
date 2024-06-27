const ErAbstract = require('./ErAbstract');
const dataized = require('../dataized');
const {DELTA} = require('../attribute/specials');
const bytesOf = require('../bytes-of');

/**
 * This Error is thrown by the {@see error} object only.
 */
class ErError extends ErAbstract {
  /**
   * Ctor.
   * @param {object} enclosure - Enclosure inside the error
   */
  constructor(enclosure) {
    super(ErError.safeMessage(enclosure))
    this.name = 'ErError'
    this.enclosure = enclosure
  }

  /**
   * Retrieve message from enclosure safely.
   * @param {object} enclosure - Enclosure inside the error
   * @returns {string} - Safe message
   */
  static safeMessage(enclosure) {
    let result
    try {
      const raw = dataized(enclosure)
      result = `${enclosure.toString()}(${DELTA} = ${bytesOf(raw).verbose()})`
    } catch (_) { /* eslint-disable-line no-unused-vars */
      result = enclosure.toString();
    }
    return result
  }
}

module.exports = ErError
