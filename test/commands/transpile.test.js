const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {runSync, comment, runEoc} = require('../helpers');

describe('transpile', function() {
  it('transpiles successfully', function(done) {
    const home = path.resolve('temp/test-transpile')
    fs.rmSync(home, {recursive: true, force: true})
    fs.mkdirSync(path.resolve(home, 'src/org/eolang'), {recursive: true})
    fs.writeFileSync(path.resolve(home, 'src/org/eolang/simple.eo'), `${comment}\n[] > simple\n`)
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
      '-r', path.resolve('test/resources/transpile')
    ]);
    assert.ok(fs.existsSync(path.resolve(target, '8-transpile/org/eolang/simple.xmir')))

    done()
  })
  it('should transpile with eoc', function(done) {
    const home = path.resolve('temp/test-transpile')
    fs.rmSync(home, {recursive: true, force: true})
    fs.mkdirSync(path.resolve(home, 'src'), {recursive: true})
    fs.writeFileSync(path.resolve(home, 'src/simple.eo'), `${comment}\n[] > simple\n`)
    const target = path.resolve(home, 'target')
    fs.mkdirSync(target, {recursive: true})
    runEoc([
      'verify',
      '--verbose',
      '-s', path.resolve(home, 'src'),
      '-t', target
    ])
    runSync([
      'transpile',
      '--verbose',
      '-t', target,
      // '-r', path.resolve('test/resources/transpile')
    ]);
    assert.ok(fs.existsSync(path.resolve(target, '8-transpile/org/eolang/simple.xmir')))
    done()
  });
})
