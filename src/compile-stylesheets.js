const path = require('path');
const fs = require('fs')
const {execSync} = require('child_process');

const xsls = path.resolve('src/resources/xsl')
const jsons = path.resolve('src/resources/json')
const all = ['attrs', 'data', 'objects', 'package', 'to-js']
const ext = '.sef.json'

/**
 * Compile style sheet from given source
 * @param {String} source - Source XSL
 * @param {String} dest - Destination
 * @return {String} - Stdout
 */
const compile = function(source, dest) {
  try {
    return execSync(
      [
        'node node_modules/xslt3/xslt3.js',
        `-xsl:${source}`,
        `-export:${dest}`
      ].join(' ')
    ).toString()
  } catch (e) {
  }
}

/**
 * Compile XLS stylesheets to JSON.
 * @param {Array.<String>|undefined} [names] - names of stylesheets to compile
 */
const compileStylesheets = function(names) {
  names = names || all
  fs.readdirSync(xsls)
    .filter((xsl) => names.includes(xsl.substring(0, xsl.lastIndexOf('.xsl'))))
    .forEach((file) => {
      const xsl = path.resolve(xsls, file)
      const json = path.resolve(jsons, file.replace(/\.xsl/g, ext))
      if (fs.existsSync(json)) {
        if (fs.statSync(xsl).mtimeMs >= fs.statSync(json).mtimeMs) {
          compile(xsl, json)
        }
      } else {
        compile(xsl, json)
      }
    })
}

module.exports = compileStylesheets
