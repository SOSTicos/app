const { λ, createError } = require('../../server/lib/utils')
const createApi = require('../../server/api')

const api = createApi()

const create = async ({ body }) => {
  await api.users.create(body, true)

  const { email } = body

  const {
    code,
    tokens: [token, confirmationToken],
  } = await api.auth.signin(email)

  await api.email.send({ email, code, token: confirmationToken, template: 'welcome' })

  return { code, token }
}

module.exports = λ(async ({ body, method }) => {
  if (method !== 'POST') {
    throw createError('Not found', 404)
  }

  try {
    const { email } = body

    const {
      code,
      tokens: [token, confirmationToken],
    } = await api.auth.signin(email)

    const res = await api.email.send({ email, code, token: confirmationToken, template: 'confirm' })
    console.log(res)
    return { code, token }
  } catch (error) {
    if (error.message !== 'Email no encontrado') {
      throw error
    }

    return create({ body })
  }
})
