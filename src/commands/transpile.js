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

const $exports = function(name) {
  return `\n\nmodule.exports = ${name}`
}

/**
 * Transpile XMIR to JavaScript.
 * @param {{foreign: String, project: String, resources: String}} options - Transpile command options
 */
const transpile = function(options) {
  options = {...program.opts(), ...options}
  const transformations = [
    'objects', 'package', 'attrs', 'data', 'to-js'
  ].map((name) => path.resolve(options['resources'], `json/${name}.sef.json`))
  const parser = new XMLParser({ignoreAttributes: false})
  const verified = 'verified'
  const dir = '8-transpile'
  const project = path.resolve(options['target'], options['project'])
  fs.mkdirSync(project, {recursive: true})

  JSON.parse(fs.readFileSync(path.resolve(options['target'], options['foreign'])).toString())
    .filter((tojo) => tojo.hasOwnProperty(verified))
    .forEach((tojo) => {
      const file = tojo[verified]
      const text = fs.readFileSync(file).toString()
      let xml = parser.parse(text)
      const target = path.resolve(options['target'], dir, `${pathFromName(xml['program']['@_name'])}.xmir`)
      fs.mkdirSync(target.substring(0, target.lastIndexOf('/')), {recursive: true})
      fs.writeFileSync(target, text)
      xml = text
      transformations.forEach((transformation) => {
        xml = saxon.transform({
          stylesheetFileName: transformation,
          sourceText: xml,
          destination: 'serialized'
        }).principalResult
      })
      fs.writeFileSync(target, xml)
      xml = parser.parse(xml)
      let objects = xml.program.objects.object
      if (!Array.isArray(objects)) {
        objects = [objects]
      }
      const filtered = objects.filter((obj) => !!obj['javascript'] && !obj['@_atom'])
      if (filtered.length > 0) {
        const first = filtered[0]
        const dest = path.resolve(project, `${pathFromName(first['@_js-name'])}.js`)
        fs.mkdirSync(dest.substring(0, dest.lastIndexOf('/')), {recursive: true})
        fs.writeFileSync(dest, first['javascript'])
        filtered
          .filter((_, index) => index > 0)
          .forEach((obj) => fs.appendFileSync(dest, `\n${obj['javascript']}`))
        fs.appendFileSync(dest, $exports(first['@_name']))
      }
    })
}

module.exports = transpile
