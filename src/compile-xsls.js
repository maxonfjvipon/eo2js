const path = require('path');
const fs = require('fs')
const {execSync} = require('child_process');

const xsls = path.resolve('src/resources/xsl')
const json = path.resolve('src/resources/json')

fs.readdir(xsls, (err, files) => {
  files.forEach((file) => {
    try {
      execSync(
        [
          'node node_modules/xslt3/xslt3.js',
          `-xsl:${path.resolve(xsls, file)}`,
          `-export:${path.resolve(json, file.replace(/\.xsl/g, '.sef.json'))}`
        ].join(' '),
        {windowsHide: true}
      )
    } catch (e) {
    }
  })
})
