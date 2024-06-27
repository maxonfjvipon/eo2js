const {program} = require('commander');
const path = require('path');
const {execSync} = require('child_process')

/**
 * Dataize command.
 * @param {string} obj - Entry object
 * @param {Array.<string>} args - EO program arguments
 * @param {{target: string, project: string}} options - Program options
 */
const dataize = function(obj, args, options) {
  options = {...program.opts(), ...options}
  const main = path.resolve(options.target, options.project, '__main__.js')
  execSync(['node', main, obj, ...args].join(' '), {stdio: 'inherit'})
}

module.exports = dataize
