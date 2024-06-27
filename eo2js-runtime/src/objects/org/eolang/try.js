const dataized = require('../../../runtime/dataized')
const object = require('../../../runtime/object')
const at_void = require('../../../runtime/attribute/at-void')
const {LAMBDA} = require('../../../runtime/attribute/specials');
const ErError = require('../../../runtime/error/ErError');
const trapped = require('../../../runtime/trapped');

/**
 * Try.
 * @returns {object} - Try object
 */
const _try = function() {
  const obj = object('try')
  obj.attrs['main'] = at_void('main')
  obj.attrs['catch'] = at_void('catch')
  obj.attrs['finally'] = at_void('finally')
  obj.assets[LAMBDA] = function(self) {
    return trapped(
      self.take('main'),
      function(property, target, thisArg, args) {
        let ret
        try {
          ret = target.call(thisArg, ...args)
        } catch (ex) {
          if (ex instanceof ErError) {
            const ctch = self.take('catch').with({
              0: ex.enclosure
            })
            ret = ctch[property].call(ctch, ...args)
          } else {
            throw ex
          }
        } finally {
          dataized(self.take('finally'))
        }
        return ret
      }
    )
  }
  return obj
}

module.exports = _try
