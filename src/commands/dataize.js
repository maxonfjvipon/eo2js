const {program} = require('commander');
const path = require('path');
const {execSync} = require('child_process')

const dataize = function(obj, args, options) {
  options = {...program.opts(), ...options}
  const main = path.resolve(options.target, options.project, '__main__.js')
  console.log(execSync(['node', main, obj, ...args].join(' ')).toString())
}

module.exports = dataize
