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
  protect((req, res) => {
    switch (req.method) {
      case 'GET':
        return fetch(req, res)
      case 'PATCH':
        return update(req, res)
      default:
    }

    throw createError('Not found', 404)
  })
)
