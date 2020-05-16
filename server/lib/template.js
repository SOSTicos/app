'use strict'

const path = require('path')
const render = require('lodash.template')
const readFiles = require('./read-files')

module.exports = async () => {
  const dir = path.resolve(process.cwd(), 'server', 'lib', 'templates')
  const templates = await readFiles(dir)

  return Object.keys(templates).reduce((template, key) => {
    template[key] = render(templates[key].toString())
    return template
  }, {})
}
