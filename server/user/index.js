const isEmail = require('is-email')
const { pick, isString } = require('lodash')
const { createError } = require('../lib/utils')
const { isProvince, isCanton, isDistrict } = require('../../shared/lib/locations')
const { isPhone, toPhone } = require('../../shared/lib/utils')

module.exports = ({ db, superadmin, seed }) => {
  const roles = ['admin', 'coordinator', 'carrier', 'beneficiary', 'member']

  const fields = [
    'name',
    'phone',
    'avatar',
    'docId',
    'role',
    'centerId',
    'province',
    'canton',
    'district',
    'address',
  ]

  const setIndexes = async () => {
    const users = await db.get('users')
    users.createIndex({ email: 1, unique: 1 })
  }

  /**
   * Normalize user object.
   *
   * @param {Object} data
   * @return {Promise}
   * @private
   */

  const normalize = (data) => {
    return {
      loginCount: 0,
      name: data.name,
      docId: data.docId,
      role: data.role || 'member',
      email: data.email.toLowerCase(),
      phone: data.phone ? toPhone(data.phone) : null,
      updatedAt: data.updateAt || Date.now(),
      createdAt: data.createdAt || Date.now(),
    }
  }

  const seedData = async () => {
    const users = await db.get('users')

    try {
      const query = { email: superadmin }
      const data = normalize({ ...query, role: 'superadmin' })
      await users.updateOne(query, data, { upsert: true })
    } catch (_) {
      console.log(_)
    }
  }

  /**
   * Fetch users.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const fetch = async ({ user, id, ...query }) => {
    user.can('read', 'user', { _id: id })
    const users = await db.get('users')
    const res = id ? await users.findById(id) : await users.findMany(query)
    if (!res) throw createError('No se encontró el usuario', 404)
    return res
  }

  /**
   * Create user.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const create = async ({ user, ...data }) => {
    if (user) user.can('create', 'user')

    const users = await db.get('users')

    if (!isEmail(data.email)) {
      throw createError('Email inválido')
    } else if ('role' in data && !roles.includes(data.role)) {
      throw createError('Rol inválido')
    } else if (data.name && !isString(data.name)) {
      throw createError('Nombre inválido')
    } else if (data.phone && !isPhone(data.phone)) {
      throw createError('Teléfono inválido')
    } else if (data.docId && !isString(data.docId)) {
      throw createError('Identificación inválida')
    } else if (await users.findOne({ email: data.email })) {
      throw createError('Este usuario ya existe')
    } else if ('province' in data && !isProvince(data.province)) {
      throw createError('Provincia inválida')
    } else if ('canton' in data && !isCanton(data.canton)) {
      throw createError('Cantón inválido')
    } else if ('district' in data && !isDistrict(data.district)) {
      throw createError('Distrito inválido')
    }

    data = normalize(data)
    return users.insertOne(data)
  }

  /**
   * Update user.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const update = async ({ user, id, role, ...data }) => {
    user.can('update', 'user', { _id: id })

    const users = await db.get('users')

    data = pick(data, fields)

    if ('name' in data && (!data.name || !isString(data.name))) {
      throw createError('Nombre inválido')
    } else if ('docId' in data && !isString(data.docId)) {
      throw createError('Identificación inválidd')
    } else if (data.centerId && !isString(data.centerId)) {
      throw createError('Centro de acopio inválido')
    } else if ('phone' in data && !isPhone(data.phone)) {
      throw createError('Teléfono inválido')
    } else if ('role' in data && !roles.includes(data.role)) {
      throw createError('Rol inválido')
    } else if ('province' in data && !isProvince(data.province)) {
      throw createError('Provincia inválida')
    } else if ('canton' in data && !isCanton(data.canton)) {
      throw createError('Cantón inválido')
    } else if ('district' in data && !isDistrict(data.district)) {
      throw createError('Distrito inválido')
    }

    if (data.phone) {
      data.phone = toPhone(data.phone)
    }

    data.updatedAt = Date.now()
    data.updatedBy = user._id

    return users.updateById(id, data)
  }

  /**
   * Destroy user.
   *
   * @param {String} data
   * @return {Promise}
   * @public
   */

  const destroy = async ({ user, id }) => {
    user.can('delete', 'user', { _id: id })

    const users = await db.get('users')
    const doc = await users.deleteById(id)
    if (!doc) throw createError(400, 'No se pudo eliminar el usuario')
    return { _id: id }
  }

  setIndexes().catch(console.log)

  if (seed) seedData()

  return { fetch, create, update, destroy, fields }
}
