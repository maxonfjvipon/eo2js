const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {pack} = require('../helpers');
const compileStylesheets = require('../../src/compile-stylesheets');

/**
 * This variable is used to skip test packs.
 * Just insert the names of the test pack, e.g. 'abstracts-to-objects',
 * and they won't be executed. It's helpful when you're introducing new test pack
 * and don't want to wait until all other packs are executed.
 * @type {string[]}
 */
const skip = [
  // 'abstracts-to-objects',
  // 'adds-attrs',
  // 'adds-package',
  // 'prepares-data',
  // 'bindings-to-js',
  // 'data-as-bytes',
  // 'embedded-object'
]
const temp = path.resolve('temp')

describe('transpile', function() {
  before('compile stylesheets', function() {
    compileStylesheets()
  })
  describe('transformation packs', function() {
    this.timeout(0)
    const packs = path.resolve(__dirname, '../resources/transpile/packs')
    fs.readdirSync(packs)
      .filter((test) => !skip.includes(test.substring(0, test.lastIndexOf('.json'))))
      .forEach((test) => {
        it(test, function(done) {
          const pth = path.resolve(temp, 'test-transpile/packs')
          const folder = path.resolve(pth, test.substring(0, test.lastIndexOf('.json')))
          if (fs.existsSync(folder)) {
            fs.rmSync(folder, {recursive: true})
          }
          const json = JSON.parse(fs.readFileSync(path.resolve(packs, test)).toString())
          const res = pack({home: folder, sources: 'src', target: 'target', json})
          if (res.skip) {
            this.skip()
          } else {
            assert.equal(
              res.failures.length,
              0,
              `Result XMIR:\n ${res.xmir}\nJSON: ${JSON.stringify(res.json, null, 2)}\nFailed tests: ${res.failures.join(';\n')}`
            )
            done()
          }
        })
      })
  })
})


// describe('transpile', function() {
//   before('compile xsls', function() {
//     if (fs.readdirSync(path.resolve(__dirname, '../../src/resources/json')).length !== xsls) {
//       execSync('node src/compile-xsls.js')
//     }
//   })
//   it('transpiles successfully', function(done) {
//     const home = path.resolve(temp, 'test-transpile')
//     fs.rmSync(home, {recursive: true, force: true})
//     const target = path.resolve(home, 'target')
//     fs.mkdirSync(target, {recursive: true})
//     const verified = path.resolve(target, '6-verify/org/eolang/simple.xmir')
//     const foreign = [{
//       id: 'org.simple',
//       verified: verified
//     }]
//     fs.writeFileSync(path.resolve(target, 'eo-foreign.json'), JSON.stringify(foreign))
//     fs.mkdirSync(path.resolve(target, '6-verify/org/eolang'), {recursive: true})
//     fs.copyFileSync(path.resolve('test/resources/transpile/simple.xmir'), verified)
//     runSync([
//       'transpile',
//       '--verbose',
//       '-t', target,
//     ]);
//     assert.ok(fs.existsSync(path.resolve(target, '8-transpile/org/eolang/simple.xmir')))
//     done()
//   })
// })
