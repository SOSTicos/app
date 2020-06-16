const config = require('./config')
const user = require('./user')
const beneficiary = require('./beneficiaries')
const auth = require('./auth')
const center = require('./center')
const createDb = require('./lib/db')
const createEmail = require('./lib/email')

module.exports = (options = {}) => {
  options = { ...config, ...options }

  if (!options.db) {
    options.db = createDb(config.mongo)
  }

  if (!options.email) {
    options.email = createEmail(config)
  }

  return {
    ...options,
    auth: auth(options),
    users: user(options),
    centers: center(options),
    beneficiaries: beneficiary(options)
  }
}
