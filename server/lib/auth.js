const ms = require('ms')
const { verify, sign } = require('jsonwebtoken')
const { createError, generateId, generateCode, generateString } = require('./utils')

const ts = (time) => {
  return Date.now() + ms(time)
}

const createTokenData = ({ email, ttl }) => {
  return {
    _id: generateId(),
    cid: generateString(),
    uid: email.toLowerCase(),
    ttl: ts(ttl),
    code: generateCode(),
    // used: false,
    // revoked: false,
    confirmed: false,
  }
}

const createToken = async (data, { secret = 'secret', ttl = '10m' } = {}) => {
  return new Promise((resolve, reject) => {
    const tokenData = createTokenData({ ...data, ttl })
    data = { _id: data._id, jti: tokenData._id }

    sign(data, secret, { expiresIn: ts(ttl) }, (error, token) => {
      if (error) reject(error)
      else resolve(token)
    })
  })
}

const verifyToken = (token, secret, options = {}) => {
  return new Promise((resolve, reject) => {
    verify(token, secret, options, (error, object) => {
      if (error) reject(createError('Invalid access token', 401))
      else resolve(object)
    })
  })
}

const getRequestToken = (request) => {
  let { token } = request.cookies

  if (!token) {
    const bearer = request.headers.authorization
    if (bearer) token = bearer.replace(/bearer /i, '')
  }

  return token
}

module.exports = {
  getRequestToken,
  createTokenData,
  createToken,
  verifyToken,
}
