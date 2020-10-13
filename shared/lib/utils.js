/* globals WEBPACK_SITE_URL */

import parsePhone from 'phone'

export const toPhone = (number, code = 'CR') => {
  if (!number) return null
  const parsed = parsePhone(String(number), code)
  if (parsed.length === 0) return null
  return parsed[0]
}

export const isPhone = (number, code, line) => {
  return Boolean(toPhone(number, code, line))
}

export const isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const getHost = (ctx) => {
  if (ctx) {
    return WEBPACK_SITE_URL
  }

  const r = window.location.href.match(/^(https?:)?\/\/[^/]+/i)
  return r ? r[0] : ''
}

export const createError = (message, code = 400) => {
  const error = new Error(message)
  error.statusCode = code
  return error
}
