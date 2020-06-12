const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user, query }) => {
  return api.users.fetch({ ...query, user })
}

const update = ({ user, body, query }) => {
  return api.users.update({ ...body, ...query, user })
}

const destroy = ({ user, query }) => {
  return api.users.destroy({ ...query, user })
}

export default λ(
  protect((request, res) => {
    switch (request.method) {
      case 'GET':
        return fetch(request, res)
      case 'PATCH':
        return update(request, res)
      case 'DELETE':
        return destroy(request, res)
      default:
    }

    throw createError('Not found', 404)
  })
)
