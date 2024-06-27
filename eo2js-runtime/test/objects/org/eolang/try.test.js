const assert = require('assert');
const tr = require('../../../../temp/objects/org/eolang/try');
const {data, STRING, BOOL} = require('../../../../temp/runtime/data');
const object = require('../../../../temp/runtime/object');
const dataized = require('../../../../temp/runtime/dataized');
const attr = require('../../../../temp/runtime/attribute/attr');
const ErFailure = require('../../../../temp/runtime/error/ErFailure');
const {PHI, LAMBDA} = require('../../../../temp/runtime/attribute/specials');
const at_simple = require('../../../../temp/runtime/attribute/at-simple');
const stdout = require('../../../../temp/objects/org/eolang/io/stdout');

/**
 * Error message.
 * @type {string}
 */
const MESSAGE = 'something is broken'

/**
 * Broken object that throws {@link ErFailure}.
 * @param {string} name - Name of the attribute or asset
 * @returns {object} - Broken
 */
const broken = function(name) {
  const obj = object('broken')
  if (name === LAMBDA) {
    obj.assets[LAMBDA] = function(_) {
      throw new ErFailure(MESSAGE)
    }
  } else {
    obj.attrs[name] = attr.lambda(obj, function(_) {
      throw new ErFailure(MESSAGE)
    })
  }
  return obj
}

/**
 * Not broken main object for try.
 * @returns {object} - Object
 */
const main = function() {
  const obj = object('main')
  obj.attrs[PHI] = at_simple(data.toObject(true))
  return obj
}

/**
 * Catcher.
 * @returns {object} - Catcher
 */
const catcher = function() {
  const obj = object('catcher')
  obj.attrs['ex'] = attr.void('ex')
  obj.attrs[PHI] = attr.lambda(obj, (rho) => rho.take('ex'))
  return obj
}

/**
 * Nop.
 * @returns {object} - Nop
 */
const nop = function() {
  const obj = object('nop')
  obj.attrs[PHI] = attr.simple(data.toObject(true))
  return obj
}

/**
 * Build try object.
 * @param {object} main - Main attribute
 * @param {object} [final] - Finally attribute
 * @returns {object} - Try object
 */
const tryObj = function(main, final) {
  return tr().with({
    'main': main,
    'catch': catcher(),
    'finally': final || nop()
  })
}

describe('try', function() {
  it(`should catch error via ${PHI}`, function() {
    assert.equal(dataized(tryObj(broken(PHI)), STRING), MESSAGE)
  })
  it(`should catch error via ${LAMBDA}`, function() {
    assert.equal(dataized(tryObj(broken(LAMBDA)), STRING), MESSAGE)
  })
  it('should be dataized to body', function() {
    assert.equal(dataized(tryObj(main()), BOOL), true)
  })
  it('should dataize "finally" attribute', function() {
    const logs = []
    dataized(
      tryObj(
        main(),
        stdout({log: (...args) => logs.push(...args)}).with({
          0: data.toObject('Hello')
        })
      )
    )
    assert.ok(logs.includes('Hello'))
  })
  it('should not dataize body twice', function() {
    const logs = []
    dataized(
      tryObj(
        stdout( {log: (...args) => logs.push(...args)}).with({
          0: data.toObject('Hey')
        })
      )
    )
    assert.equal(logs.length, 1)
  })
})
