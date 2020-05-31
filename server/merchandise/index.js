const { createError } = require('../lib/utils')

module.exports = ({ db }) => {
  const fields = ['arrivalDate', 'center', 'photo', 'description', 'departureDate']

  /**
   * Normalize merchandise object.
   *
   * @param {Object} data
   * @return {Promise}
   * @private
   */

  const normalize = (data, uploadedPhotoKey) => {
    return {
      arrivalDate: new Date(data.arrivalDate),
      center: data.center,
      photo: uploadedPhotoKey,
      description: data.description,
      departureDate: data.departureDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  }

  /**
   * Fetch merchandise date.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const fetch = async ({ user, id, ...query }) => {
    user.can('read', 'merchandise')
    const merchandiseCollection = await db.get('merchandise')

    const result = id
      ? await merchandiseCollection.findById(id)
      : await merchandiseCollection.findMany(query)
    if (!result) throw createError('No se encontró la mercadería solicitada', 404)
    return result
  }

  /**
   * Create merchandise record.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */

  const create = async ({ user, ...data }, api) => {
    user.can('create', 'merchandise')

    const uploadedPhotoKey = await api.upload(data.file)

    data = normalize(data, uploadedPhotoKey)
    data.userId = user._id

    const centers = await db.get('merchandise')
    return centers.insertOne(data)
  }

  return { fetch, create, fields }
}
