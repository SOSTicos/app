const config = require('./config')
const user = require('./user')
const auth = require('./auth')
const center = require('./center')
const merchandise = require('./merchandise')
const createDb = require('./lib/db')
const createEmail = require('./lib/email')
const createFileStorage = require('./lib/fileStorage')

module.exports = (options = {}) => {
  options = { ...config, ...options }

  if (!options.db) {
    options.db = createDb(config.mongo)
  }

  if (!options.email) {
    options.email = createEmail(config)
  }

  if (!options.fileStorage) {
    options.fileStorage = createFileStorage(config)
  }

  return {
    ...options,
    auth: auth(options),
    users: user(options),
    centers: center(options),
    merchandise: merchandise(options),
  }
}
