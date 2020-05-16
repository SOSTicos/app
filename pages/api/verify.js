const { λ, createError } = require('../../server/lib/utils')
const createApi = require('../../server/api')

const api = createApi()

module.exports = λ(async (request) => {
  if (request.method !== 'GET') {
    throw createError('Not found', 404)
  }

  return api.auth.verify(request.query)
})
