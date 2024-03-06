const {program} = require('commander')
const transpile = require('./commands/transpile');
const link = require('./commands/link');
const version = require('./version');
const dataize = require('./commands/dataize');

program
  .name('eo2js')
  .usage('[options] command')
  .summary('EO to JS command line toolkit')
  .description('EOLANG to JavaScript command-line toolkit (' + version.what + ' built on ' + version.when + ')')
  .version(version.what, '-v, --version', 'Output the version number')
  .helpOption('-?, --help', 'Print this help information');

program
  .option('-t, --target <path>', 'Target directory with all generated files', '.eoc')
  .option('-p, --project <path>', 'Path to result JavaScript project', 'project')
  .option('-r, --resources <path>', 'Path to the resources', 'src/resources')
  // .option('--hash <hex>', 'Hash in objectionary/home to compile against', parser)
  // .option('--parser <version>', 'Set the version of EO parser to use', parser)
  // .option('--latest', 'Use the latest parser version from Maven Central')
  // .option('--alone', 'Just run a single command without dependencies')
  // .option('-b, --batch', 'Run in batch mode, suppress interactive messages')
  // .option('--no-color', 'Disable colorization of console messages')
  // .option('--track-optimization-steps', 'Save intermediate XMIR files')
  // .option('-c, --clean', 'Delete ./.eoc directory')
  .option('--verbose', 'Print debug messages and full output of child processes');

/**
 * Transpile.
 */
program.command('transpile')
  .description('Convert XMIR to JavaScript executable files')
  .option('-f, --foreign <path>', 'Path to foreign tojos', 'eo-foreign.json')
  .action(transpile)

/**
 * Link.
 */
program.command('link')
  .description('Build npm project')
  .action(link)

/**
 * Dataize.
 */
program.command('dataize')
  .description('Dataize program')
  .action((opts) => dataize(program.args[1], program.args.slice(2), opts))

try {
  program.parse(process.argv)
} catch (e) {
  console.error(e.message)
  console.debug(e.stack)
  process.exit(1)
}
