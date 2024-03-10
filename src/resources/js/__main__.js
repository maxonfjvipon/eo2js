const phi = require('eo2js-runtime/src/runtime/phi')
const dataized = require('eo2js-runtime/src/runtime/dataized')
const data = require('eo2js-runtime/src/runtime/data')
const ErAbstract = require('eo2js-runtime/src/runtime/error/ErAbstract')

/**
 * Run application.
 */
const main = function() {
  try {
    let app = phi.take(process.argv[2])
    if (process.argv.length > 3) {
      const tuple = phi.take('org.eolang.tuple')
      let args = tuple.take('empty')
      process.argv.slice(3).forEach((arg) => {
        args = tuple.copy().with({
          0: args,
          1: data.toObject(arg)
        })
      })
      app = app.with({0: args})
    }
    console.log(dataized(app))
  } catch (error) {
    if (error instanceof ErAbstract) {
      console.error(error.message)
      console.error(error.stack)
    } else {
      throw error
    }
  }
}

main()
