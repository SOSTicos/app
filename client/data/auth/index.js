import ms from 'ms'
import * as api from './api'
import * as cons from './constants'
import * as tokens from '../../../shared/lib/tokens'

export const signin = async (email) => {
  const { token, code } = await api.signin({ service: 'web', email })
  const expires = Date.now() + ms(cons.VERIFICATION_TOKEN_TTL)
  return { email, token, code, expires }
}

export const verify = async ({ email, token }) => {
  return api.verify({ email, token })
}

export const signout = async (ctx) => {
  try {
    await api.signout()
  } catch (_) {
  } finally {
    tokens.del(ctx)
  }
}

export const isAuth = (ctx) => {
  const token = tokens.get(ctx)
  return Boolean(token)
}
