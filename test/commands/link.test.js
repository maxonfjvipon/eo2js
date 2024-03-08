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
   * @return {String} - Stdout.
   */
  const link = function() {
    return runSync(['link', '-t', target, '-p project --alone'])
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
})
