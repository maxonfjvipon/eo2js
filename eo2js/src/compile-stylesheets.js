const path = require('path');
const fs = require('fs')
const {execSync} = require('child_process');

const xsls = path.resolve('src/resources/xsl')
const jsons = path.resolve('src/resources/json')
const all = ['attrs', 'data', 'objects', 'package', 'to-js', 'tests']
const ext = '.sef.json'

/**
 * Compile style sheet from given source
 * @param {string} source - Source XSL
 * @param {string} dest - Destination
 * @returns {string} - Stdout
 */
const compile = function(source, dest) {
  console.log(`Recompiling ${source}`)
  let out = ""
  try {
    out = execSync(
      [
        'node node_modules/xslt3/xslt3.js',
        `-xsl:${source}`,
        `-export:${dest}`
      ].join(' ')
    ).toString()
  } catch (_) { /* eslint-disable-line */
  }
  return out
}

/**
 * Compile XLS stylesheets to JSON.
 * @param {Array.<string>|undefined} [names] - names of stylesheets to compile
 */
const compileStylesheets = function(names) {
  console.log('Recompiling stylesheets...')
  let recompiled = 0
  names = names || all
  fs.readdirSync(xsls)
    .filter((xsl) => names.includes(xsl.substring(0, xsl.lastIndexOf('.xsl'))))
    .forEach((file) => {
      const xsl = path.resolve(xsls, file)
      const json = path.resolve(jsons, file.replace(/\.xsl/g, ext))
      if (fs.existsSync(json)) {
        if (fs.statSync(xsl).mtimeMs >= fs.statSync(json).mtimeMs) {
          compile(xsl, json)
          recompiled++
        }
      } else {
        compile(xsl, json)
        recompiled++
      }
    })
  console.log(`Recompiled ${recompiled} stylesheets`)
}

module.exports = compileStylesheets
