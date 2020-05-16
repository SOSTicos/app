const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user, query }) => {
  return api.centers.fetch({ ...query, user })
}

const update = ({ user, body }) => {
  return api.centers.update({ ...body, user })
}

const destroy = ({ user, query }) => {
  return api.centers.destroy({ ...query, user })
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

    throw createError('Not found', 404)
  })
)
