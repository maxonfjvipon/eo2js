const {RHO, LAMBDA, PHI} = require('./attribute/specials.js')
const ErFailure = require('./error/ErFailure');
const validated = require('./validated');
const safe = require('./safe');
const at_rho = require('./attribute/at-rho');
const with_rho = require('./with-rho');
const {DELTA} = require('./attribute/specials');

/**
 * Vertex counter.
 * @type {number}
 */
let vertex = 0

/**
 * Object.
 * @param {string} name - Name of the object
 * @returns {object} Object
 */
const object = function(name = 'object') {
  const vtx = ++vertex
  return {
    /**
     * Attributes.
     */
    attrs: {},
    /**
     * Assets.
     */
    assets: {},
    /**
     * Copy itself.
     * @returns {object} - Copied object.
     */
    copy: function() {
      const copy = object(name)
      Object.keys(this.attrs)
        .forEach((key) => {
          copy.attrs[key] = this.attrs[key].copy(copy)
        })
      Object.keys(this.assets)
        .forEach((key) => {
          copy.assets[key] = this.assets[key]
        })
      return copy
    },
    /**
     * Set attributes or {@see DELTA} asset to the object.
     * @param {object} bindings - Attribute bindings
     * @returns {object} - Self with attached attributes
     * @throws ErFailure - If something wrong with bindings
     */
    with: function(bindings) {
      const copy = this.copy()
      const attrs = Object.keys(copy.attrs)
      Object.keys(bindings).forEach((attr) => {
        const binding = bindings[attr]
        const pos = Number(attr)
        if (!isNaN(pos)) {
          if (pos < 0) {
            throw new ErFailure(`Can't put attribute by negative position (${pos})`)
          }
          if (!Number.isInteger(pos)) {
            throw new ErFailure(`Can't put attribute by float position (${pos})`)
          }
          const filtered = attrs.filter((at) => at !== RHO)
          const index = filtered.findIndex((_, index) => index === pos)
          if (index === -1) {
            throw new ErFailure(`There's no attribute with position ${pos}`)
          }
          attr = filtered[index]
        }
        if (attr === DELTA) {
          copy.assets[DELTA] = binding
        } else {
          if (!attrs.includes(attr)) {
            throw new ErFailure(`Attribute ${attr} is absent, can't put`)
          }
          copy.attrs[attr].put(binding)
        }
      })
      return copy
    },
    /**
     * Retrieve object by attribute/asset name
     * @param {string} name - Attribute/asset name
     * @returns {object} - Retrieved attribute/asset by name
     * @throws ErFailure - If something wrong with attribute/asset retrieving
     */
    take: function(name) {
      name = String(name)
      let object
      if (name === RHO && !Object.hasOwn(this.attrs, RHO)) {
        object = at_rho().get()
      } else if (name === LAMBDA) {
        if (Object.hasOwn(this.attrs, LAMBDA)) {
          throw new ErFailure(`'${LAMBDA}' can't be used as attribute, only as asset`)
        }
        if (!Object.hasOwn(this.assets, LAMBDA)) {
          throw new ErFailure(`Can't take '${LAMBDA}' asset because it's absent`)
        }
        object = validated(
          () => safe(with_rho(this.assets[LAMBDA](this), this, name))
        )
      } else if (Object.hasOwn(this.attrs, name)) {
        object = validated(
          () => safe(with_rho(this.attrs[name].get(), this, name))
        )
      } else if (Object.hasOwn(this.attrs, PHI)) {
        object = this.take(PHI).take(name)
      } else if (Object.hasOwn(this.assets, LAMBDA)) {
        object = this.take(LAMBDA).take(name)
      } else {
        throw new ErFailure(`Can't find '${name}' attribute in '${this.toString()}'`)
      }
      return object
    },
    /**
     * Retrieve data from the object
     * @returns {Array.<number>} - Data
     */
    data: function() {
      let data
      if (Object.hasOwn(this.assets, DELTA)) {
        data = this.assets[DELTA]
      } else if (Object.hasOwn(this.assets, LAMBDA)) {
        data = this.take(LAMBDA).data()
      } else if (Object.hasOwn(this.attrs, PHI)) {
        data = this.take(PHI).data()
      } else {
        throw new ErFailure(`There's no data in the object ${this.toString()}, can't take it`)
      }
      return data
    },
    /**
     * Print itself.
     * @returns {string} - String representation of object
     */
    toString: function() {
      return `${name}ν${vtx}`
    },
    /**
     * Forma of itself.
     * @returns {string} - Forma
     * @todo #61:30min Make forma contained full FQN of the object. Now forma of the object is the
     *  last part of its FQN. For example, if object is 'org.eolang.int', it's forma is 'int' which
     *  is wrong, it should be 'org.eolang.int'. So we need to fix this naming and make sure
     *  that, for example, 'org.eolang.int' and 'com.example.int' have different formas.
     */
    forma: function() {
      return name
    },
    /**
     * Represent self as φ term.
     * @returns {string} - Self as φ calculus term
     */
    φTerm: function() {
      const list = []
      const binding = (left, right) => `${left} ↦ ${right}`
      if (Object.hasOwn(this.assets, DELTA)) {
        list.push(binding(DELTA, `[${this.assets[DELTA].join(', ')}]`))
      }
      if (Object.hasOwn(this.assets, LAMBDA)) {
        list.push(binding(LAMBDA, 'Lambda'))
      }
      list.push(
        ...Object.keys(this.attrs)
          .filter((attr) => attr !== RHO)
          .map((attr) => binding(attr, this.attrs[attr].φTerm()))
      )
      let term = name
      if (list.length !== 0) {
        term = `ν${vtx}·${term}⟦\n\t${list.sort().join(',\n').replaceAll(/\n/g, '\n\t')}\n⟧`
      }
      return term
    }
  }
}

module.exports = object
