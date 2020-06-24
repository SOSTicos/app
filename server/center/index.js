const isEmail = require('is-email')
const { pick, isString, isUndefined } = require('lodash')
const { createError } = require('../lib/utils')
const { isPhone } = require('../../shared/lib/utils')
const { isProvince, isDistrict, isCanton } = require('../../shared/lib/locations')

module.exports = ({ db }) => {
  const fields = ['name', 'phone', 'email', 'province', 'canton', 'district', 'address']

  /**
   * Check if user exist.
   *
   * @param {String|ObjectID} usersId
   * @return {Promise}
   * @private
   */

  const isUser = async (id) => {
    const users = await db.get('users')
    const user = await users.findById(id)
    return Boolean(user)
  }

  /**
   * Normalize collection center object.
   *
   * @param {Object} data
   * @return {Promise}
   * @private
   */

  const normalize = (data) => {
    return {
      name: data.name,
      // phone: toPhone(data.phone),
      // email: data.email.toLowerCase(),
      province: data.province,
      canton: data.canton,
      district: data.district,
      address: data.address,
      userId: data.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  /**
   * Fetch payment centers.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const fetch = async ({ user, id, ...query }) => {
    user.can('read', 'center')
    const centers = await db.get('centers')

    const res = id ? await centers.findById(id) : await centers.findMany(query)
    if (!res) throw createError('No se encontró el centro de acopio', 404)
    return res
  }

  /**
   * Create collection center.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const create = async ({ user, ...data }) => {
    user.can('create', 'center')

    const centers = await db.get('centers')

    if (!data.name || !isString(data.name)) {
      throw createError('Nombre inválido')
    } else if (!data.province || !isProvince(data.province)) {
      throw createError('Provincia inválida')
    } else if (!data.canton || !isCanton(data.canton)) {
      throw createError('Cantón inválido')
    } else if (!data.district || !isDistrict(data.district)) {
      throw createError('Distrito inválido')
    } else if (!isPhone(data.phone)) {
      // throw createError('Teléfono inválido')
    } else if (!isEmail(data.email)) {
      // throw createError('Email inválido')
    }

    data = normalize(data)
    data.userId = user._id

    return centers.insertOne(data)
  }

  /**
   * Update collection center.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const update = async ({ user, id, userId, ...data }) => {
    user.can('update', 'center', { centerId: id })
    const centers = await db.get('centers')

    data = pick(data, fields)

    if ('name' in data && (!data.name || !isString(data.name))) {
      throw createError('Nombre inválido')
    } else if ('province' in data && !isProvince(data.province)) {
      throw createError('Provincia inválida')
    } else if ('canton' in data && !isCanton(data.canton)) {
      throw createError('Cantón inválido')
    } else if ('district' in data && !isDistrict(data.district)) {
      throw createError('Distrito inválido')
    } else if ('phone' in data && !isPhone(data.phone)) {
      // throw createError('Teléfono inválido')
    } else if ('email' in data && !isEmail(data.email)) {
      // throw createError('Email inválido')
    } else if (!isUndefined(userId) && !(await isUser(userId))) {
      throw createError(`Usuario ${userId} inválido`)
    }

    // if (data.email) {
    //   data.email = data.email.toLowerCase()
    // }

    // if (data.phone) {
    //   data.phone = toPhone(data.phone)
    // }

    if (userId) {
      data.userId = userId
    }

    data.updatedAt = Date.now()

    return centers.updateById(id, data)
  }

  /**
   * Destroy collection center.
   *
   * @param {String} email
   * @param {String} token
   * @return {Promise}
   * @public
   */

  const destroy = async ({ user, id }) => {
    user.can('delete', 'center', { centerId: id })
    const centers = await db.get('centers')
    const doc = await centers.deleteById(id)
    if (!doc) throw createError(400, 'No se pudo eliminar el centro de acopio')
    return { _id: id }
  }

  return { fetch, create, update, destroy, fields }
}
