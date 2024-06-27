const {program} = require('commander');
const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process');

/**
 * Entry point JS file.
 * @type {string}
 */
const main = '__main__.js'

/**
 * Data to insert to package.json file.
 * If path to local dependency is present - eo2js-runtime dependency won't be added.
 * @param {string} [runtime] - Path to local eo-runtime dependency
 * @param {boolean} [tests] - Add dependencies for testing
 * @returns {{author: string, name: string, version: string}} - The content for package.json file
 */
const pckg = function(runtime, tests) {
  const def = {
    name: 'project',
    version: '1.0.0',
    author: 'eo2js',
    type: 'commonjs',
    dependencies: {}
  }
  if (!runtime) {
    def.dependencies = {
      ...def.dependencies,
      'eo2js-runtime': 'latest'
    }
  }
  if (tests) {
    def.dependencies = {
      ...def.dependencies,
      'mocha': 'latest'
    }
  }
  return def
}

/**
 * Build npm project.
 * @param {{target: string, project: string, resources: string, dependency: ?string, tests: ?boolean}} options - Program options
 */
const link = function(options) {
  options = {...program.opts(), ...options}
  const project = path.resolve(options.target, options.project)
  fs.writeFileSync(
    path.resolve(project, 'package.json'),
    JSON.stringify(pckg(options.dependency, options.tests))
  )
  execSync('npm install', {cwd: project})
  fs.copyFileSync(
    path.resolve(options.resources, `js/${main}`),
    path.resolve(project, main)
  )
  if (options.dependency) {
    fs.cpSync(
      options.dependency,
      path.resolve(project, 'node_modules/eo2js-runtime'),
      {recursive: true}
    )
  }
}

module.exports = link
