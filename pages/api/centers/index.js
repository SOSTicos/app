const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user, query }) => {
  return api.centers.fetch({ ...query, user })
}

const create = ({ user, body }) => {
  return api.centers.create({ ...body, user })
}

export default λ(
  protect((req, res) => {
    switch (req.method) {
      case 'GET':
        return fetch(req, res)
      case 'POST':
        return create(req, res)
      default:
    }

    throw createError('Not found', 404)
  })
)
