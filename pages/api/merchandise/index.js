const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user, query }) => {
  return api.merchandise.fetch({ ...query, user })
}

const create = ({ user, body }) => {
  return api.merchandise.create({ ...body, user }, api.fileStorage)
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default λ(
  protect((request, result) => {
    switch (request.method) {
      case 'GET':
        return fetch(request, result)
      case 'POST':
        return create(request, result)
      default:
    }

    throw createError('Not found', 404)
  })
)
