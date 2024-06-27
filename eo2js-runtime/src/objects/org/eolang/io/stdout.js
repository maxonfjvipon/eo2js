const object = require('../../../../runtime/object.js')
const dataized = require('../../../../runtime/dataized')
const {data, STRING} = require('../../../../runtime/data')
const {LAMBDA} = require('../../../../runtime/attribute/specials')
const at_void = require('../../../../runtime/attribute/at-void');

/**
 * Stdout.
 * @param {{log: (function(...args: any): void)}} out - Out
 * @returns {any} - Stdout object
 */
const stdout = function(out = console) {
  const obj = object('stdout')
  obj.attrs['text'] = at_void('text')
  obj.assets[LAMBDA] = function(self) {
    out.log(dataized(self.take('text'), STRING))
    return data.toObject(true)
  }
  return obj
}

module.exports = stdout
