const {RHO, LAMBDA, PHI, DELTA} = require('../../temp/runtime/attribute/specials.js')
const assert = require('assert')
const object = require('../../temp/runtime/object')
const at_simple = require('../../temp/runtime/attribute/at-simple')
const at_void = require('../../temp/runtime/attribute/at-void')
const ErFailure = require('../../temp/runtime/error/ErFailure');
const ErError = require('../../temp/runtime/error/ErError');
const with_rho = require('../../temp/runtime/with-rho');
const at_rho = require('../../temp/runtime/attribute/at-rho');

describe('object', function() {
  it(`should not have ${RHO} attribute at the beginning`, function() {
    assert.ok(!(RHO in object().attrs))
  })
  it(`should have empty assets`, function() {
    assert.equal(Object.keys(object().assets).length, 0)
  })
  it('should be able to be printed', function() {
    assert.doesNotThrow(() => object().toString())
  })
  it('should not be equal to other object', function() {
    assert.notDeepStrictEqual(object(), object())
  })
  describe('#take()', function() {
    it('should set rho to self', function() {
      const first = object('first')
      const second = object('second')
      first.attrs['attr'] = at_simple(second)
      assert.deepStrictEqual(first.take('attr').take(RHO).toString(), first.toString())
    })
    it('should not copy on dispatch if rho is set', function() {
      const first = object('f')
      const second = object('s')
      const third = with_rho(object('t'), second, 'attr')
      first.attrs['attr'] = at_simple(third)
      assert.deepStrictEqual(first.take('attr').toString(), third.toString())
      assert.deepStrictEqual(third.take(RHO).toString(), second.toString())
    })
    it('should copy object on dispatch', function() {
      const first = object()
      const second = object()
      second.attrs['attr'] = at_simple(first)
      assert.notDeepStrictEqual(second.take('attr'), first)
    })
    it(`should return object through ${PHI} attribute`, function() {
      const first = object('first')
      const second = object()
      const phi = object()
      phi.attrs['attr'] = at_simple(first)
      second.attrs[PHI] = at_simple(phi)
      assert.ok(second.take('attr').toString().includes('first'))
    })
    it(`should return object through ${LAMBDA} asset`, function() {
      const first = object('first')
      const second = object()
      const third = object()
      third.attrs['attr'] = at_simple(first)
      second.assets[LAMBDA] = function(_) {
        return third
      }
      assert.ok(second.take('attr').toString().includes('first'))
    })
    it('should throw an error if no attribute with given name', function() {
      assert.throws(() => object().take('attr'))
    })
    it(`should throw an error if no attribute in ${PHI} wih given name`, function() {
      const obj = object()
      const phi = object()
      obj.attrs[PHI] = at_simple(phi)
      assert.throws(() => obj.take('attr'))
    })
    it(`should throw an error if no attribute in ${LAMBDA} wih given name`, function() {
      const obj = object()
      obj.assets[LAMBDA] = function(_) {
        return object()
      }
      assert.throws(() => obj.take('attr'))
    })
    it(`should throw an error if ${LAMBDA} attribute is being taken`, function() {
      const obj = object()
      obj.attrs[LAMBDA] = at_simple({})
      assert.throws(() => obj.take(LAMBDA), ErFailure)
    })
    it(`should throw an error if absent ${LAMBDA} asset is being taken`, function() {
      assert.throws(() => object().take(LAMBDA), ErFailure)
    })
    it(`should validate the result of ${LAMBDA} asset`, function() {
      const obj = object()
      obj.assets[LAMBDA] = function(_) {
        throw new ErFailure('error')
      }
      assert.throws(() => obj.take(LAMBDA), ErError)
    })
    it(`should wrap with "safe" the result of ${LAMBDA} asset`, function() {
      const obj = object()
      obj.assets[LAMBDA] = function(_) {
        return {
          attrs: {},
          copy: function() {
            return this
          },
          take: (_) => {
            throw new ErFailure('take')
          },
          with: (_) => {
            throw new ErFailure('with')
          }
        }
      }
      const res = obj.take(LAMBDA)
      assert.throws(() => res.take(''), ErError)
      assert.throws(() => res.with({}), ErError)
    })
    it('should wrap attribute with "at_safe"', function() {
      const obj = object()
      obj.attrs['x'] = at_void('x')
      assert.throws(() => obj.take('x'), ErError)
    })
  })
  describe('#with()', function() {
    it('should copy itself', function() {
      const obj = object()
      const applied = obj.with({})
      assert.notDeepStrictEqual(obj, applied)
    })
    it('should put the right object by name', function() {
      let first = object()
      const second = object('second')
      first.attrs['attr'] = at_void('attr')
      first = first.with({attr: second})
      assert.ok(first.take('attr').toString().includes('second'))
    })
    it('should put object by position', function() {
      let first = object()
      const second = object('second')
      first.attrs['attr'] = at_void('attr')
      first = first.with({0: second})
      assert.ok(first.take('attr').toString().includes('second'))
    })
    it('should put object by 2nd position', function() {
      let first = object()
      const second = object('s')
      first.attrs['f'] = at_void('f')
      first.attrs['s'] = at_void('s')
      first = first.with({1: second})
      assert.throws(() => first.take('f'))
      assert.ok(first.take('s').toString().includes('s'))
    })
    it('should return copy of self', function() {
      const obj = object('somebody')
      obj.attrs['f'] = at_void('f')
      const applied = obj.with({f: object()})
      assert.notDeepStrictEqual(applied, obj)
      assert.notEqual(applied.toString(), obj.toString())
      assert.ok(applied.toString().includes('somebody'))
    })
    it('should throw an error if position is negative', function() {
      const obj = object()
      obj.attrs['attr'] = at_void('attr')
      assert.throws(() => obj.with({'-1': object()}))
    })
    it('should throw an error if position if float', function() {
      const obj = object()
      obj.attrs['attr'] = at_void('attr')
      assert.throws(() => obj.with({'1.5': object()}))
    })
    it('should throw an error if attribute with name is absent', function() {
      assert.throws(() => object().with({'at': object()}))
    })
    it('should throw an error if attribute with position is absent', function() {
      assert.throws(() => object().with({0: object()}))
    })
  })
  describe('#copy()', function() {
    it('should make a true copy', function() {
      const obj = object()
      assert.notDeepStrictEqual(obj.copy(), obj)
    })
    it('should make a true copy of the attribute', function() {
      const obj = object()
      const attr = object()
      obj.attrs['attr'] = at_simple(attr)
      assert.notDeepStrictEqual(obj.copy().take('attr'), attr)
    })
    it(`should save the ${RHO} attribute`, function() {
      const obj = object('o')
      const rho = object('rho')
      obj.attrs[RHO] = at_rho(rho)
      assert.deepStrictEqual(obj.copy().take(RHO).toString(), rho.toString())
    })
    it('should copy assets', function() {
      const obj = object()
      obj.assets[LAMBDA] = function(_) {
        return object()
      }
      obj.assets[DELTA] = [0x01, 0x00]
      const copy = obj.copy()
      assert.deepStrictEqual(obj.assets, copy.assets)
    })
  })
  describe('#φTerm()', function() {
    it('should contain all properties', function() {
      const somebody = object('somebody')
      somebody.attrs['m'] = at_void('m')
      const obj = object('x')
      obj.attrs['y'] = at_void('y')
      obj.attrs['s'] = at_simple(somebody)
      obj.assets[DELTA] = [1, 2, 3]
      obj.assets[LAMBDA] = () => {}
      const term = obj.φTerm()
      console.debug(term)
      assert.ok(term.includes('·x⟦'))
      assert.ok(term.includes('Δ ↦ [1, 2, 3],'))
      assert.ok(term.includes('λ ↦ Lambda'))
      assert.ok(term.includes('s ↦ λ,'))
      assert.ok(term.includes('y ↦ Ø,'))
    })
  })
})
