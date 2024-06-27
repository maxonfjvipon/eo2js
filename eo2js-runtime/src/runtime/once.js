/**
 * Evaluate object lazily only once.
 * @param {function(): object} callback - Function to evaluate
 * @returns {object} - Lazily evaluated object
 */
const once = function(callback) {
  let cached = null
  return new Proxy(
    callback,
    {
      get: function(target, property, _) {
        if (cached === null) {
          cached = target()
        }
        return cached[property]
      }
    }
  )
}

module.exports = once
