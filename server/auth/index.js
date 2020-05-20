const isEmail = require('is-email')
const { isString } = require('lodash')
const { createError } = require('../lib/utils')
const createACL = require('../../shared/lib/acl')
const { getRequestToken, createToken, createTokenData, verifyToken } = require('../lib/auth')

module.exports = ({ db, secret, signInTokenTTL, accessTokenTTL }) => {
  const setIndexes = async () => {
    const tokens = await db.get('tokens', { castIds: false })

    tokens.createIndex({ ttl: 1 }, { expireAfterSeconds: 1 })
    tokens.createIndex({ cid: 1, uid: 1 })
  }

  /**
   * Signin user by generating a pair token.
   *
   * @param {String} email
   * @return {Promise}
   * @public
   */

  const signin = async (email) => {
    const users = await db.get('users')
    const tokens = await db.get('tokens', { castIds: false })

    if (!isEmail(email)) {
      throw createError('Email inválido')
    }

    email = email.toLowerCase()
    const user = await users.findOne({ email })

    if (!user) {
      throw createError('Email no encontrado', 404)
    }

    const ttl = signInTokenTTL
    const data = await createTokenData({ email, ttl })

    const token = await tokens.insertOne({
      ...data,
      service: 'web',
      ttl: new Date(data.ttl),
    })

    return {
      code: token.code,
      tokens: [String(token._id), String(token.cid)],
    }
  }

  /**
   * Confirm email signin token.
   *
   * @param {String} email
   * @param {String} token
   * @return {Promise}
   * @public
   */

  const confirm = async ({ email, token }) => {
    const tokens = await db.get('tokens', { castIds: false })

    if (!token || !isString(token)) {
      throw createError('Token de confirmación inválido')
    } else if (!isEmail(email)) {
      throw createError('Email inválido')
    }

    email = email.toLowerCase()
    const doc = await tokens.findOne({ cid: token, uid: email })

    if (!doc) throw createError('Token de confirmación inválido', 401)
    else if (doc.confirmed) throw createError('El token ya no es válido', 401)

    await tokens.updateById(doc._id, { confirmed: true })

    return doc
  }

  /**
   * Verify signin token.
   *
   * @param {String} email
   * @param {String} token
   * @return {Promise}
   * @public
   */

  const verify = async ({ email, token }) => {
    const tokens = await db.get('tokens', { castIds: false })
    const users = await db.get('users')

    if (!token || !isString(token)) {
      throw createError('Token de verificación inválido')
    } else if (!isEmail(email)) {
      throw createError('Email inválido')
    }

    email = email.toLowerCase()
    const doc = await tokens.findOne({ _id: token, uid: email })

    if (!doc) throw createError('Token de verificación inválido', 401)
    else if (!doc.confirmed) throw createError('Verificación incompleta', 403)

    let user = await users.findOne({ email })

    if (!user) throw createError('Usuario inválido')

    await tokens.deleteById(doc._id)

    const accessToken = await createToken(user, { audience: doc.service, ttl: accessTokenTTL })

    const update = {
      $set: { updatedAt: Date.now() },
      $inc: { loginCount: 1 },
    }

    user = await users.updateOne({ email }, update)
    return { user, token: accessToken }
  }

  const protect = (fn) => async (req, res) => {
    const users = await db.get('users')

    try {
      const token = getRequestToken(req)
      const auth = await verifyToken(token, secret)
      const user = await users.findById(auth._id)

      if (!user) {
        throw createError('No autorizado', 401)
      }

      req.user = { ...auth, ...user }

      if (req.user) {
        req.user._id = String(req.user._id)
        req.acl = createACL(req.user)
      }
    } catch (error) {
      console.log(error)
      throw createError('No autorizado', 401)
    }

    return fn(req, res)
  }

  setIndexes().catch(console.log)

  return { protect, signin, confirm, verify }
}
