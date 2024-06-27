module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['temp'],
    mochacli: {
      test: {
        options: {
          timeout: '1200000',
          require: ['test/global.js'],
          files: ['test/regular.js'],
        },
      },
    },
    eslint: {
      options: {
        overrideConfigFile: 'eslint.config.js',
      },
      target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    },
  })
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-mocha-cli')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.registerTask('default', ['mochacli', 'eslint'])
}
