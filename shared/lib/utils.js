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

export const getHost = (ctx) => {
  if (ctx) {
    const { req } = ctx
    const protocol = req.protocol ? req.protocol : `http`
    return `${protocol}://${req.headers.host}`
  }

  const r = window.location.href.match(/^(https?:)?\/\/[^/]+/i)
  return r ? r[0] : ''
}

export const createError = (message, code = 400) => {
  const error = new Error(message)
  error.statusCode = code
  return error
}
