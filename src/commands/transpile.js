const {program} = require('commander');
const path = require('path');
const fs = require('fs');
const saxon = require('saxon-js')
const {XMLParser} = require('fast-xml-parser');

/**
 * Get path from given object name.
 * E.g. org.eolang.int -> org/eolang/int
 * @param {String} name - Name of the object. May contain dots
 * @return {String} - path from object name
 */
const pathFromName = function(name) {
  return name.replace(/\./g, '/')
}

/**
 * Export given variable from module.
 * @param {String} name - Variable name
 * @return {String} - `\n\nmodule.exports = ${string}`
 */
const exporting = function(name) {
  return `\n\nmodule.exports = ${name}`
}

/**
 * Make directory if not exist.
 * @param {String} dir - Directory
 */
const makeDirIfNotExist = function(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true})
  }
}

/**
 * Transpile XMIR to JavaScript.
 * @param {{foreign: String, project: String, resources: String}} options - Transpile command options
 */
const transpile = function(options) {
  options = {...program.opts(), ...options}
  const foreign = path.resolve(options['target'], options['foreign'])
  if (!fs.existsSync(foreign)) {
    throw new Error(`File ${foreign} is not found`)
  }
  if (!foreign.endsWith('.json')) {
    throw new Error(`Only .json foreign tojos file is supported, given ${foreign.substring(foreign.lastIndexOf('/'))}`)
  }
  const transformations = [
    'objects', 'package', 'attrs', 'data', 'to-js'
  ].map((name) => path.resolve(options['resources'], `json/${name}.sef.json`))
  const parser = new XMLParser({ignoreAttributes: false})
  const verified = 'verified'
  const dir = '8-transpile'
  const project = path.resolve(options['target'], options['project'])
  fs.mkdirSync(project, {recursive: true})
  JSON.parse(fs.readFileSync(foreign).toString())
    .filter((tojo) => tojo.hasOwnProperty(verified))
    .forEach((tojo) => {
      const text = fs.readFileSync(tojo[verified]).toString()
      let xml = parser.parse(text)
      const transpiled = path.resolve(options['target'], dir, `${pathFromName(xml['program']['@_name'])}.xmir`)
      makeDirIfNotExist(transpiled.substring(0, transpiled.lastIndexOf('/')))
      fs.writeFileSync(transpiled, text)
      xml = text
      transformations.forEach((transformation) => {
        xml = saxon.transform({
          stylesheetFileName: transformation,
          sourceText: xml,
          destination: 'serialized'
        }).principalResult
      })
      fs.writeFileSync(transpiled, xml)
      xml = parser.parse(xml)
      let objects = xml.program.objects.object
      if (!Array.isArray(objects)) {
        objects = [objects]
      }
      const filtered = objects.filter((obj) => obj.hasOwnProperty('javascript') && !obj.hasOwnProperty('@_atom'))
      if (filtered.length > 0) {
        const first = filtered[0]
        const dest = path.resolve(project, `${pathFromName(first['@_js-name'])}.js`)
        makeDirIfNotExist(dest.substring(0, dest.lastIndexOf('/')))
        fs.writeFileSync(dest, first['javascript'])
        filtered.slice(1).forEach((obj) => fs.appendFileSync(dest, `\n${obj['javascript']}`))
        fs.appendFileSync(dest, exporting(first['@_name']))
      }
    })
}

module.exports = transpile
