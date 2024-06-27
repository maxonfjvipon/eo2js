const path = require('path');
const {execSync} = require('child_process');
const fs = require('fs');

/**
 * Version.
 * @type {null|string}
 */
let ver = null

/**
 * Get EO version.
 * @returns {string} - EO version
 */
const version = function() {
  if (ver == null) {
    ver = fs.readFileSync(path.resolve(__dirname, 'eo-version.txt')).toString().trim()
  }
  return ver
}

/**
 * The shell to use (depending on operating system).
 * @returns {string|undefined} - Path to shell or "undefined" if default one should be used
 */
function shell() {
  if (process.platform === 'win32') {
    return 'C:\\Windows\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe';
  }
  return undefined
}

/**
 * Prepare options for Maven.
 * @param {{sources: string, target: string, home: string}} opts - Options
 * @returns {Array.<string>} - Maven options
 */
const flags = function(opts) {
  return [
    '-Deo.version=' + version(),
    `-Deo.sourcesDir=${path.resolve(opts.home, opts.sources)}`,
    `-Deo.targetDir=${path.resolve(opts.home, opts.target)}`,
  ]
}

/**
 * Execute given goals of eo-maven-plugin.
 * @param {Array.<string>} goals - Goals to execute in right order
 * @param {{sources: string, target: string, home: string}} opts - Options
 */
const mvnw = function(goals, opts) {
  const bin = path.resolve(__dirname, 'mvnw') + (process.platform === 'win32' ? '.cmd' : '');
  const params = [
    ...flags(opts),
    '--batch-mode',
    '--color=never',
    '--update-snapshots',
    '--fail-fast',
    '--strict-checksums',
  ]
  execSync(
    [
      bin,
      ...goals.map((goal) => `org.eolang:eo-maven-plugin:${goal}`),
      ...process.platform === 'win32' ? params.map((p) => `"${p}"`) : params,
    ].join(' '),
    {
      cwd: __dirname,
      // stdio: 'inherit',
      shell: shell(),
    }
  )
}

module.exports = mvnw

