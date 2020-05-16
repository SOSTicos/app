import { omitBy, isNil } from 'lodash'
import * as tokens from '../../shared/lib/tokens'
import { getHost } from '../../shared/lib/utils'
import { get } from './api'

export const getRequestToken = (request) => {
  let { token } = request.cookies

  if (!token) {
    const bearer = request.headers.authorization
    if (bearer) token = bearer.replace(/bearer /i, '')
  }

  return token
}

export const getSession = async (ctx) => {
  try {
    const host = getHost(ctx)
    const token = tokens.get(ctx)
    const options = { headers: { cookie: ctx.req.headers.cookie } }

    let centers = []
    let user = await get(`${host}/api/me`, {}, options)

    if (user && !user._id) {
      user = null
    }

    if (user) {
      centers = await get(`${host}/api/centers`, {}, options)
    }

    console.log('USER ====>', centers)

    return omitBy({ user, token, centers }, isNil)
  } catch (_) {
    console.log(_)
    return {}
  }
}

export const getHeaders = (ctx) => {
  return { cookie: ctx.req.headers.cookie }
}
