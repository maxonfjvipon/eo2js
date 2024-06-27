const phi = require('../../temp/runtime/phi')
const {RHO} = require('../../temp/runtime/attribute/specials')
const assert = require('assert')
const pckg = require('../../temp/runtime/package')
const fs = require('fs');
const path = require('path');

describe('package object', function() {
  afterEach('clear temp', function() {
    const temp = path.resolve(__dirname, 'temp')
    if (fs.existsSync(temp)) {
      fs.rmSync(temp, {recursive: true})
    }
  })
  describe('empty', function() {
    it('should be child of phi', function() {
      assert.deepStrictEqual(phi.take('').take(RHO), phi)
    })
    it(`should have ${RHO} attribute`, function() {
      assert.ok(RHO in pckg('', {}).attrs)
    })
    describe('#take()', function() {
      it('should return next level package object', function() {
        const obj = pckg('', {})
        assert.notDeepStrictEqual(obj.take('org'), obj)
      })
      it('should return child of empty package object', function() {
        const obj = pckg('', {})
        assert.deepStrictEqual(obj.take('org').take(RHO), obj)
      })
      it('should cache next level object', function() {
        const obj = pckg('', {})
        assert.deepStrictEqual(obj.take('org'), obj.take('org'))
      })
      it('should fail on wrong path', function() {
        assert.throws(() => pckg('', {}).take('wrong'))
      })
      it('should return the same next level object with and without dots', function() {
        const obj = pckg('', {})
        assert.deepStrictEqual(
          obj.take('org').take('eolang'),
          obj.take('org.eolang')
        )
      })
      it('should not fail if finds EO object', function() {
        assert.doesNotThrow(() => pckg('', {}).take('org.eolang.io.stdout').toString())
      })
      it('should return new object on every dispatch', function() {
        const empty = pckg('', {})
        assert.notEqual(
          empty.take('org.eolang.io.stdout').toString(),
          empty.take('org.eolang.io.stdout').toString()
        )
      })
      it('should find object outside "node_modules"', function() {
        const modules = path.resolve(__dirname, 'temp/node_modules')
        fs.mkdirSync(modules, {recursive: true})
        fs.cpSync(
          path.resolve(__dirname, '../../src'),
          path.resolve(modules, 'eo2js-runtime/src'),
          {recursive: true}
        )
        const eolang = path.resolve(__dirname, 'temp/org/eolang')
        fs.mkdirSync(eolang, {recursive: true})
        fs.writeFileSync(
          path.resolve(eolang, 'dummy.js'),
          'module.exports = function () {' +
          '  return {name: "Dummy", attrs: {}, copy: function() { return this }} ' +
          '}'
        )
        const pack = require(
          path.resolve(__dirname, 'temp/node_modules/eo2js-runtime/src/runtime/package')
        )
        const dummy = pack('', phi).take('org.eolang.dummy')
        assert.equal(dummy.name, 'Dummy')
      })
    })
    describe('#with()', function() {
      it('should fail on put', function() {
        assert.throws(() => pckg('', {}).with({0: 'any'}))
      })
    })
    describe('#copy()', function() {
      it('should return itself', function() {
        const obj = pckg('', {})
        assert.deepStrictEqual(obj.copy(), obj)
      })
    })
  })
  describe('"org"', function() {
    it(`should have ${RHO} attributes`, function() {
      const obj = pckg('', {}).take('org')
      assert.ok(RHO in obj.attrs)
    })
    describe('#with()', function() {
      it('should fail on put', function() {
        assert.throws(() => pckg('', {}).take('org').with({0: 'any'}))
      })
    })
    describe('#copy()', function() {
      it('should return itself', function() {
        const org = pckg('', {}).take('org')
        assert.deepStrictEqual(org.copy(), org)
      })
    })
    describe('#take()', function() {
      it('should return child "eolang" package object', function() {
        const org = pckg('', {}).take('org')
        assert.deepStrictEqual(org.take('eolang').take(RHO), org)
      })
      it('should fail on wrong path', function() {
        const org = pckg('', {}).take('org')
        assert.throws(() => org.take('wrong'))
      })
    })
  })
})
