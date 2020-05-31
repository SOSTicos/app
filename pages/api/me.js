const { λ, createError } = require('../../server/lib/utils')
const createApi = require('../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user }) => {
  return api.users.fetch({ user, id: user._id })
}

const update = ({ user, body }) => {
  return api.users.update({ ...body, user, id: user._id })
}

export default λ(
  protect((request, result) => {
    switch (request.method) {
      case 'GET':
        return fetch(request, result)
      case 'PATCH':
        return update(request, result)
      default:
    }

    throw createError('Not found', 404)
  })
)
