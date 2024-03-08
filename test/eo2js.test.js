const {runSync} = require('./helpers');
const assert = require('assert');
const version = require('../src/version');

describe('eo2js', function() {
  it('should print its own version', function() {
    const stdout = runSync(['--version'])
    assert.equal(version.what + '\n', stdout)
  })
  it('should print help screen', function() {
    const stdout = runSync(['--help'])
    assert.ok(stdout.includes('Usage: eo2js'))
    assert.ok(stdout.includes(version.what))
    assert.ok(stdout.includes(version.when))
  });
})
