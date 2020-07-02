const cryptoRandomString = require('crypto-random-string')
const { ObjectID } = require('mongodb')
const trees = require('./trees')

const generateString = (length_ = 24) => {
  return cryptoRandomString({ length: length_ })
}

const generateCode = () => {
  return trees[Math.floor(Math.random() * trees.length)]
}

const generateId = () => {
  return String(new ObjectID())
}

const createError = (message, code = 400) => {
  const error = new Error(message)
  error.statusCode = code
  return error
}

const λ = (fn) => async (request, response) => {
  try {
    const data = await fn(request, response)
    response.statusCode = 200
    if (Object.prototype.hasOwnProperty.call(data, 'Content-Type')) {
      response.setHeader('Content-Type', data['Content-Type'])
      response.send(data.stream)
    } else {
      response.json(data)
    }
  } catch (error) {
    if (error.statusCode === 401) return response.end(error.message)
    response.statusCode = error.statusCode || 500
    response.json({ error: true, status: response.statusCode, message: error.message })
    console.error(error.message)
  }
}

const round = (number) => {
  return Number(Math.round(number + 'e+1') + 'e-1')
}

const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const toBoolean = (value) => {
  return !/^(false|0)$/i.test(value) && Boolean(value)
}

module.exports = {
  generateString,
  generateCode,
  generateId,
  createError,
  toBoolean,
  round,
  sleep,
  λ,
}
