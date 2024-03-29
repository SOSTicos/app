const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user, query }) => {
  return api.merchandise.fetch({ ...query, user })
}

const update = ({ user, body, query }) => {
  return api.merchandise.update({ ...body, ...query, user })
}

const destroy = ({ user, query }) => {
  return api.merchandise.destroy({ ...query, user })
}

export default λ(
  protect((req, res) => {
    switch (req.method) {
      case 'GET':
        return fetch(req, res)
      case 'PATCH':
        return update(req, res)
      case 'DELETE':
        return destroy(req, res)
      default:
    }

    throw createError('Detail Not found', 404)
  })
)
