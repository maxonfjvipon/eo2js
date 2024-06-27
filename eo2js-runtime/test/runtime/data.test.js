const assert = require('assert');
const {data, INT, STRING, FLOAT, BOOL} = require('../../temp/runtime/data')
const dataized = require('../../temp/runtime/dataized');

const isObject = function(obj) {
  return Object.hasOwn(obj, 'attrs') &&
    Object.hasOwn(obj, 'assets') &&
    Object.hasOwn(obj, 'take') &&
    Object.hasOwn(obj, 'copy') &&
    Object.hasOwn(obj, 'with') &&
    Object.hasOwn(obj, 'data') &&
    Object.hasOwn(obj, 'forma') &&
    Object.hasOwn(obj, 'φTerm') &&
    Object.hasOwn(obj, 'toString')
}

describe('data', function() {
  describe('to int', function() {
    it('should convert to object', function() {
      assert.ok(isObject(data.toObject(5)))
    })
    it('should be dataized as int', function() {
      const value = BigInt(42)
      assert.equal(dataized(data.toObject(value), INT), value)
    })
  })
  describe('to string', function() {
    it('should convert string to object', function() {
      assert.ok(isObject(data.toObject('Hello')))
    })
    it('should be dataized as string', function() {
      assert.equal(dataized(data.toObject('Hello'), STRING), 'Hello')
    })
  })
  describe('to float', function() {
    it('should convert float to object', function() {
      assert.ok(isObject(data.toObject(42.7)))
    })
    it('should be dataized as float', function() {
      assert.equal(dataized(data.toObject(13.2), FLOAT), 13.2)
    })
  })
  describe('to bool', function() {
    it('should convert bool to object', function() {
      assert.ok(isObject(data.toObject(true)))
    })
    it('should be dataized as bool', function() {
      assert.equal(dataized(data.toObject(false), BOOL), false)
    })
  })
  describe('to bytes', function() {
    it('should convert byte array to object', function() {
      assert.ok(isObject(data.toObject([0, 1, 2])))
    })
    it('should be dataized as byte array', function() {
      assert.deepEqual(dataized(data.toObject([10, 52, 28])), [10, 52, 28])
    })
  })
})
