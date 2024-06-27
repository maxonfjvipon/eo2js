const js = require('@eslint/js')
const jsdoc = require('eslint-plugin-jsdoc')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    plugins: {
      jsdoc
    },
    files: ["**/*.js"],
    rules: {
      "jsdoc/require-description": "error",
      "jsdoc/check-values": "error"
    }
  },
  {
    rules: {
      semi: 'off',
      'comma-dangle': 'off',
      indent: ['error', 2],
      camelcase: 'off',
      'max-len': ['error', {'code': 300}],
      'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    }
  }
]