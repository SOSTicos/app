const { λ, createError } = require('../../../server/lib/utils')
const createApi = require('../../../server/api')

const api = createApi()
const { protect } = api.auth

const fetch = ({ user, query }) => {
  // return api.users.fetch({ query: { role: 'carrier' }, user });
  query = { $or: [{ role: 'carrier' }, { role: 'coordinator' }] }
  return api.users.fetch({ ...query, user })
}

export default λ(
  protect((req, res) => {
    switch (req.method) {
      case 'GET':
        return fetch(req, res)
      default:
    }

    throw createError('Not found', 404)
  })
)
