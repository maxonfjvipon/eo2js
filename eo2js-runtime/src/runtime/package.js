const fs = require('fs')
const path = require('path')
const object = require('./object')
const {LAMBDA, RHO} = require('./attribute/specials')
const at_simple = require('./attribute/at-simple')
const ErFailure = require('./error/ErFailure');
const at_rho = require('./attribute/at-rho');
const with_rho = require('./with-rho');

/**
 * Try to find an object by given directory and FQN.
 * Context "this" should be set to the object {@link pckg}.
 * @param {string} dir - Relative directory where object may be placed
 * @param {string} name - Name of the current object
 * @param {Array.<string>} fqn - Parts of FQN of the object. E.g. ['org', 'eolang', 'int']
 * @returns {object|null} - Found object or null
 */
const tryFind = function(dir, name, fqn) {
  let obj = null
  const pth = path.resolve(__dirname, dir, ...fqn)
  if (fs.existsSync(pth)) {
    this.attrs[name] = at_simple(pckg(name, this))
    obj = this.take(name)
  } else {
    const file = `${pth}.js`
    if (fs.existsSync(file)) {
      this.attrs[name] = at_simple(require(file)())
      obj = this.take(name)
    }
  }
  return obj
}

/**
 * Found object.
 * Tries to find object in local directory. If there's no luck, checks if
 * we're in the "node_modules" directory (which means, that eo2js-runtime is used as
 * dependency). If so - tries to find object in main project directory.
 * Context "this" should be set to the object {@link pckg}.
 * @param {string} name - Name of the object
 * @param {string} full - FQN of the object
 * @returns {object} - Found object
 */
const found = function(name, full) {
  const split = full.split('.')
  let obj = tryFind.call(this, '../objects', name, split)
  if (obj == null && __dirname.includes('node_modules')) {
    obj = tryFind.call(this, '../../../..', name, split)
  }
  if (obj == null) {
    throw new Error(`Couldn't find object '${name}' from '${full}'`)
  }
  return obj
}

/**
 * Package object.
 * @param {string} fqn - FQN of package object
 * @param {object} rho - Rho
 * @returns {object} - Package object
 */
const pckg = function(fqn, rho) {
  const obj = object(`Package '${fqn}'`)
  obj.attrs[RHO] = at_rho(rho)
  obj.assets[LAMBDA] = function(self) {
    if (fqn !== '') {
      const rho = self.take(RHO)
      return `${rho.assets[LAMBDA](rho)}.${fqn}`
    }
    return fqn
  }
  obj.with = function(_) {
    throw new ErFailure(`Can't put object to Package object '${fqn}'`)
  }
  obj.take = function(name) {
    let obj
    if (Object.hasOwn(this.attrs, name)) {
      obj = with_rho(this.attrs[name].get(), this, name)
    } else if (!name.includes('.')) {
      const before = this.assets[LAMBDA](this)
      const full = before === '' ? name : `${before.substring(1)}.${name}`
      obj = found.call(this, name, full)
    } else {
      const split = name.split('.')
      let next = this.take(split[0])
      for (let i = 1; i < split.length; ++i) {
        next = next.take(split[i])
      }
      obj = next
    }
    return obj
  }
  obj.copy = function() {
    return this
  }
  return obj
}

module.exports = pckg
