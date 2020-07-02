const { v4: uuid } = require('uuid')
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

  const normalize = (data, uploadedPhotoKey, uploadedThumbnailKey) => {
    return {
      arrivalDate: new Date(data.arrivalDate),
      centerId: data.centerId,
      photo: uploadedPhotoKey,
      thumbnail: uploadedThumbnailKey,
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
      : await merchandiseCollection.findMany(query, { sort: '-arrivalDate' })
    if (!result) throw createError('No se encontró el donativo solicitado', 404)
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

    const photoName = `merchandise/photo_${uuid()}`
    const thumbnailName = `${photoName}_thumbnail`

    const uploadedPhotoKey = await api.upload(photoName, data.photo)
    const uploadedThumbnailKey = await api.upload(thumbnailName, data.thumbnail)

    data = normalize(data, uploadedPhotoKey, uploadedThumbnailKey)
    data.userId = user._id

    const merchandise = await db.get('merchandise')
    return merchandise.insertOne(data)
  }

  /**
   * Obtain merchandise thumbnail.
   *
   * @param {Object} data
   * @return {Promise}
   * @public
   */
  const thumbnail = async ({ user, ...data }, result, api) => {
    user.can('read', 'merchandise')

    const thumbnail = await api.thumbnail(data.id)
    const stream = thumbnail.createReadStream()
    return { 'Content-Type': 'image/jpeg', stream }
  }

  return { fetch, create, thumbnail, fields }
}
