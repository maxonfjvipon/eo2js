const {program} = require('commander');
const path = require('path');
const fs = require('fs');
const saxon = require('saxon-js')
const {XMLParser} = require('fast-xml-parser');

/**
 * Verified key.
 * @type {string}
 */
const verified = 'verified'

/**
 * Result directory for transpiled XMIRs.
 * @type {string}
 */
const dir = '8-transpile'

/**
 * Get path from given object name.
 * E.g.
 * - name org.eolang.int + pckg '' -> path org/eolang/int
 * - name org.eolang.int.test + pckg org.eolang -> path org/eolang/int.test
 * If name ends with ".test" and package
 * @param {string} name - Name of the object. May contain dots
 * @returns {string} - path from object name
 */
const pathFromName = function(name) {
  return name.replace(/\./g, path.sep)
}

/**
 * Make directory if not exist.
 * @param {string} dir - Directory
 */
const makeDirIfNotExist = function(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true})
  }
}

/**
 * Check if given XMIR has meta.
 * @param {any} xmir - XMIR
 * @param {string} name - Name of the meta
 * @returns {boolean} - If given XMIR has tests meta or not
 */
const hasMeta = function(xmir, name) {
  const metas = xmir.program.metas.meta
  let res = false
  if (Array.isArray(metas)) {
    res = metas.findIndex((meta) => meta.head === name) !== -1
  } else if (typeof metas === 'object' && Object.hasOwn(metas, 'head')) {
    res = metas.head === name
  }
  return res
}

/**
 * Transform XMIR from given tojo and save.
 * @param {object} tojo - Tojo.
 * @param {{target: string, project: string}} options - Program options
 * @param {Array.<string>} transformations - List of transformations to apply to XMIR
 * @param {any} parser - XML parser
 */
const transform = function(tojo, options, transformations, parser) {
  const text = fs.readFileSync(tojo[verified]).toString()
  let xml = parser.parse(text)
  const pth = pathFromName(xml['program']['@_name'])
  const transpiled = path.resolve(options.target, dir, `${pth}.xmir`)
  makeDirIfNotExist(transpiled.substring(0, transpiled.lastIndexOf(path.sep)))
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
  const filtered = objects.filter((obj) => !!obj && Object.hasOwn(obj, 'javascript') && !Object.hasOwn(obj, '@_atom'))
  const isTest = hasMeta(xml, 'tests')
  const count = isTest ? 0 : 1
  if (filtered.length > count) {
    const first = filtered[0]
    const dest = path.resolve(options.project, `${pth}${isTest ? '.test' : ''}.js`)
    makeDirIfNotExist(dest.substring(0, dest.lastIndexOf(path.sep)))
    fs.writeFileSync(dest, first['javascript'])
    filtered.slice(1).forEach((obj) => fs.appendFileSync(dest, `\n${obj['javascript']}`))
  }
}

/**
 * Transpile XMIR to JavaScript.
 * @param {{foreign: string, project: string, resources: string}} options - Transpile command options
 */
const transpile = function(options) {
  options = {...program.opts(), ...options}
  const foreign = path.resolve(options['target'], options['foreign'])
  if (!fs.existsSync(foreign)) {
    throw new Error(`File ${foreign} is not found`)
  }
  if (!foreign.endsWith('.json')) {
    throw new Error(`Only .json foreign tojos file is supported, given ${foreign.substring(foreign.lastIndexOf(path.sep))}`)
  }
  const transformations = [
    'objects', 'package', 'tests', 'attrs', 'data', 'to-js'
  ].map((name) => path.resolve(options['resources'], `json/${name}.sef.json`))
  const parser = new XMLParser({ignoreAttributes: false})
  const project = path.resolve(options['target'], options['project'])
  fs.mkdirSync(project, {recursive: true})
  JSON.parse(fs.readFileSync(foreign).toString())
    .filter((tojo) => Object.hasOwn(tojo, verified))
    .forEach((tojo) => transform(
      tojo,
      {target: options['target'], project},
      transformations,
      parser
    ))
}

module.exports = transpile
