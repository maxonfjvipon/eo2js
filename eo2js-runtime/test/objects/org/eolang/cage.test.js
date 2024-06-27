const phi = require('../../../../temp/runtime/phi');
const {data} = require('../../../../temp/runtime/data');
const dataized = require('../../../../temp/runtime/dataized');
const attr = require('../../../../temp/runtime/attribute/attr');
const object = require('../../../../temp/runtime/object');
const assert = require('assert');
const {FLOAT} = require('../../../../src/runtime/data');
const {LAMBDA} = require('../../../../src/runtime/attribute/specials');
const {RECURSION_THRESHOLD} = require('../../../../src/runtime/traced');

/**
 * Encaged object.
 * @param {object} object - Object to encage
 * @returns {object} - Cage
 */
const encaged = function(object) {
  return phi.take('org.eolang.cage').with({
    0: object
  }).take('new')
}

/**
 * Encage given object to given cage.
 * @param {object} cage - Cage
 * @param {object} obj - Object to encage
 */
const encageTo = function(cage, obj) {
  dataized(cage.take('encage').with({
    0: obj
  }))
}

/**
 * Dummy object.
 * @param {number} num - Number
 * @returns {object} - Dummy object
 */
const dummy = function(num) {
  const obj = object('dummy')
  obj.attrs['x'] = attr.simple(data.toObject(num))
  return obj
}

/**
 * Recursive dummy.
 * @param {object} cage - Cage
 * @param {number} depth - Depth
 * @returns {object} - Recursive dummy
 */
const recursiveDummy = function(cage, depth) {
  let counter = 0
  const obj = object('dummy')
  obj.assets[LAMBDA] = function(_) {
    if (++counter >= depth) {
      return data.toObject(1)
    } else {
      return cage
    }
  }
  return obj
}

describe('cage', function() {
  it('should encage via application', function() {
    const cage = encaged(data.toObject(1))
    assert.equal(dataized(cage, FLOAT), 1)
  })
  it('should encage and reencage', function() {
    const cage = encaged(data.toObject(1))
    encageTo(cage, data.toObject(2))
    assert.equal(dataized(cage, FLOAT), 2)
  })
  it('should overwrite caged object', function() {
    const cage = encaged(dummy(1))
    assert.equal(dataized(cage.take('x'), FLOAT), 1)
    encageTo(cage, dummy(2))
    assert.equal(dataized(cage.take('x'), FLOAT), 2)
  })
  it('should encage object on copying', function() {
    const first = encaged(data.toObject(1))
    const second = first.copy()
    encageTo(second, data.toObject(2))
    assert.equal(dataized(first, FLOAT), 2)
  })
  it('should write and rewrite primitive', function() {
    const cage = encaged(data.toObject(1))
    assert.equal(dataized(cage, FLOAT), 1)
    encageTo(cage, data.toObject(5))
    assert.equal(dataized(cage, FLOAT), 5)
  })
  it('should no write primitive formed differently', function() {
    const cage = encaged(data.toObject(1))
    assert.throws(() => encageTo(cage, data.toObject('Hello, world!')))
  })
  it('should not write bounded method', function() {
    const five = data.toObject(5)
    const ten = five.take('plus').with({
      0: data.toObject(5)
    })
    const cage = encaged(five)
    assert.throws(() => encageTo(cage, ten))
  })
  it('should throw error on recursion', function() {
    const cage = encaged(phi.take('org.eolang.cage').take('encaged'))
    encageTo(cage, cage)
    assert.throws(() => dataized(cage))
  })
  it('should not throw an error on small depth', function() {
    const cage = encaged(recursiveDummy(object(), 1))
    encageTo(cage, recursiveDummy(cage, RECURSION_THRESHOLD / 2))
    assert.doesNotThrow(() => dataized(cage))
  })
  it('should not throw on max depth', function() {
    const cage = encaged(recursiveDummy(object(), 1))
    encageTo(cage, recursiveDummy(cage, RECURSION_THRESHOLD))
    assert.doesNotThrow(() => dataized(cage))
  })
  it('should throw an error on big depth', function() {
    const cage = encaged(recursiveDummy(object(), 1))
    encageTo(cage, recursiveDummy(cage, RECURSION_THRESHOLD + 1))
    assert.throws(() => dataized(cage))
  })
})
