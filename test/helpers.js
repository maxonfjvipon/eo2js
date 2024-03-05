const path = require('path')
const assert = require('assert')
const fs = require('fs')
const {execSync} = require('child_process')

/**
 * Execute JS file with node.
 *
 * @param {String} js - JS file to execute
 * @param {Array.<String>} args - Arguments
 * @return {string} Stdout
 */
const execNode = function(js, args) {
  try {
    return execSync(
      `node ${js} ${args.join(' ')}`,
      {
        'timeout': 1200000,
        'windowsHide': true,
      }
    ).toString()
  } catch (ex) {
    console.log(ex.stdout.toString())
    throw ex
  }
};

/**
 * Run EOLANG compiler.
 *
 * @param {Array.<String>} args - Arguments
 * @return {string} - Stdout
 */
const runEoc = function(args) {
  return execNode(path.resolve('./node_modules/eolang/src/eoc.js'), args)
}

/**
 * Helper to run eo2js command line tool.
 *
 * @param {Array.<string>} args - Array of args
 * @return {String} Stdout
 */
const runSync = function(args) {
  return execNode(path.resolve('./src/eo2js.js'), args)
};

/**
 * Assert that all files exist.
 *
 * @param {String} stdout - The stdout printed
 * @param {String} home - The location of files to match
 * @param {Array} paths - Array of file paths
 */
const assertFilesExist = function(stdout, home, paths) {
  paths.forEach((p) => {
    const abs = path.resolve(home, p)
    assert(
      fs.existsSync(abs),
      stdout + '\nFile ' + abs + ' is absent'
    )
  })
};

/**
 * Default comment in front of abstract EO object.
 * @type {string}
 */
const comment = '# This is the default 64+ symbols comment in front of named abstract object.'

module.exports = {
  assertFilesExist,
  runSync,
  runEoc,
  comment
}
