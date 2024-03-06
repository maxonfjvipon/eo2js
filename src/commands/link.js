const {program} = require('commander');
const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process');

/**
 * Entry point file.
 * @type {string}
 */
const main = '__main__.js'

/**
 * Data to insert to package.json file.
 * @type {{author: string, name: string, version: string, dependencies: {}}}
 */
const pckg = {
  name: 'project',
  version: '1.0.0',
  author: 'eoc',
  dependencies: {
    'eo2js-runtime': 'latest'
  },
}

/**
 * Build npm project.
 * @param {Object} options
 */
const link = function(options) {
  options = {...program.opts(), ...options}
  const project = path.resolve(options.target, options.project)
  fs.writeFileSync(path.resolve(project, 'package.json'), JSON.stringify(pckg))
  execSync('npm install', {
    cwd: project,
    timeout: 1200000,
  })
  fs.copyFileSync(
    path.resolve(options.resources, `js/${main}`),
    path.resolve(project, main)
  )
}

module.exports = link
