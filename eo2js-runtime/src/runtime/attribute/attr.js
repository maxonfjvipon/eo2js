const once = require('./at-once')
const simple = require('./at-simple')
const free = require('./at-void')
const lambda = require('./at-lambda')

/**
 * API for attributes.
 * @type {{
 *  lambda: (object: object, callback: (object) => object) => any,
 *  void: (string) => any,
 *  once: (object) => any,
 *  simple: (object) => any
 * }}
 */
const attr = {
  once,
  simple,
  void: free,
  lambda,
}

module.exports = attr
