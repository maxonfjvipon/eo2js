const {runSync, assertFilesExist} = require('../helpers')
const path = require('path');
const fs = require('fs');

describe('link', function() {
  const home = path.resolve('temp/test-link')
  const target = path.resolve(home, 'target')
  const project = path.resolve(target, 'project')
  beforeEach('clear home', function() {
    fs.rmSync(home, {recursive: true, force: true})
    fs.mkdirSync(project, {recursive: true})
  })
  /**
   * Run "link" command.
   * @param {string} [args] - Arguments
   * @returns {string} - Stdout.
   */
  const link = function(...args) {
    return runSync([
      'link',
      '-t', target,
      '-p project',
      '--alone',
      '-d', path.resolve('../eo2js-runtime'),
      ...args
    ])
  }
  it('should create all necessary files and install npm project', function(done) {
    assertFilesExist(link(), project, [
      'package.json',
      'package-lock.json',
      'node_modules/eo2js-runtime',
      '__main__.js'
    ])
    done()
  })
  it('should add test dependency', function(done) {
    this.timeout(10000)
    assertFilesExist(link('--tests'), project, ['node_modules/mocha'])
    done()
  })
})
