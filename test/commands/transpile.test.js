const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {runSync} = require('../helpers');
const {execSync} = require('child_process')

const xsls = fs.readdirSync(path.resolve(__dirname, '../../src/resources/xsl')).length

describe('transpile', function() {
  before('compile xsls', function() {
    if (fs.readdirSync(path.resolve(__dirname, '../../src/resources/json')).length !== xsls) {
      execSync('node src/compile-xsls.js')
    }
  })
  it('transpiles successfully', function(done) {
    const home = path.resolve('temp/test-transpile')
    fs.rmSync(home, {recursive: true, force: true})
    const target = path.resolve(home, 'target')
    fs.mkdirSync(target, {recursive: true})
    const verified = path.resolve(target, '6-verify/org/eolang/simple.xmir')
    const foreign = [{
      id: 'org.simple',
      verified: verified
    }]
    fs.writeFileSync(path.resolve(target, 'eo-foreign.json'), JSON.stringify(foreign))
    fs.mkdirSync(path.resolve(target, '6-verify/org/eolang'), {recursive: true})
    fs.copyFileSync(path.resolve('test/resources/transpile/simple.xmir'), verified)
    runSync([
      'transpile',
      '--verbose',
      '-t', target,
    ]);
    assert.ok(fs.existsSync(path.resolve(target, '8-transpile/org/eolang/simple.xmir')))
    done()
  })
})
