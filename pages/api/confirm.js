const { createError } = require('../../server/lib/utils')
const readTemplates = require('../../server/lib/template')
const createApi = require('../../server/api')

const api = createApi()

let templates = null

module.exports = async (request, response) => {
  if (!templates) {
    templates = await readTemplates()
  }

  if (request.method !== 'GET') {
    throw createError('Not found', 404)
  }

  try {
    await api.auth.confirm(request.query)
    response.end(templates['email-confirmed']())
  } catch (error) {
    console.log(error)
    response.end(templates['email-confirmed-error']())
  }
}
