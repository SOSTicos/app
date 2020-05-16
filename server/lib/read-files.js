'use strict'

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readDir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

module.exports = async (dirName) => {
  const fileNames = await readDir(dirName)

  const promises = fileNames.map((fileName) => {
    return readFile(dirName + '/' + fileName, 'utf-8')
  })

  const docs = await Promise.all(promises)

  return fileNames.reduce((files, fileName, i) => {
    const { name } = path.parse(fileName)
    files[name] = docs[i]
    return files
  }, {})
}
