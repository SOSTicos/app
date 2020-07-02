const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const thumbnail = ({ user, query }, result) => {
  return api.merchandise.thumbnail({ ...query, user }, result, api.fileStorage)
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
        try {
          return thumbnail(request, result)
        } catch (_) {
          console.error('Failed retrieving photo')
          throw createError('Not found', 404)
        }

      default:
    }

    throw createError('Not allowed', 405)
  })
)
