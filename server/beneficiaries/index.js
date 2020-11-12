const { v4: uuid } = require('uuid')
const isEmail = require('is-email')
const { isString } = require('lodash')
const { createError } = require('../lib/utils')
const { isProvince, isCanton, isDistrict } = require('../../shared/lib/locations')
const { toPhone } = require('../../shared/lib/utils')

module.exports = ({ db }) => {
  const fields = [
    'name',
    'phone',
    'email',
    'docId',
    'centerId',
    'address',
    'province',
    'canton',
    'district',
    'necesities',
    'status',
    'deliveryStatus',
    'carrier',
    'photo',
    'thumbnail',
  ]

  const setIndexes = async () => {
    const beneficiaries = await db.get('beneficiaries')
    beneficiaries.createIndex({ id: 1, unique: 1 })
  }

  const normalize = (data) => {
    return {
      docId: data.docId,
      centerId: data.centerId,
      name: data.name,
      phone: data.phone ? toPhone(data.phone) : null,
      email: data.email?.toLowerCase(),
      address: data.address,
      province: data.province,
      canton: data.canton,
      necesities: data.necesities,
      district: data.district,
      status: data.status ? data.status : '0',
      updatedAt: data.updateAt || Date.now(),
      createdAt: data.createdAt || Date.now(),
    }
  }

  const fetch = async ({ user, id, ...query }) => {
    user.can('read', 'beneficiary', { _id: id })
    const beneficiaries = await db.get('beneficiaries')
    const res = id ? await beneficiaries.findById(id) : await beneficiaries.findMany(query)
    if (!res) throw createError('No se encontró el beneficiario', 404)
    return res
  }

  const create = async ({ user, ...data }) => {
    if (user) user.can('create', 'beneficiary')

    const beneficiaries = await db.get('beneficiaries')

    if (await beneficiaries.findOne({ docId: data.docId }))
      throw createError('Este beneficiario ya existe')
    await validateBeneficiary(data)

    data = normalize(data)
    return beneficiaries.insertOne(data)
  }

  const update = async ({ user, id, userId, ...data }, api) => {
    user.can('update', 'beneficiary', { beneficiaryId: id })
    const beneficiaries = await db.get('beneficiaries')

    let updateData = {}
    if (data.deliveryStatus === '2') {
      // Upload the fotos.
      if (
        data.photo === null ||
        data.photo === undefined ||
        data.thumbnail === null ||
        data.thumbnail === undefined
      )
        throw createError('No se puede poner donativo como entregado sin una foto de la entrega.')

      let uploadedPhotoKey = null
      let uploadedThumbnailKey = null
      try {
        // name and upload files.
        const photoName = `deliveries/photo_${uuid()}`
        const thumbnailName = `${photoName}_thumbnail`
        uploadedPhotoKey = await api.upload(photoName, data.photo)
        uploadedThumbnailKey = await api.upload(thumbnailName, data.thumbnail)
      } catch (error) {
        throw createError('No se pudo cargar la foto y thumbnail. Error: ' + error)
      }

      if (
        uploadedPhotoKey === null ||
        uploadedPhotoKey === undefined ||
        uploadedThumbnailKey === null ||
        uploadedThumbnailKey === undefined
      )
        throw createError('Error al cargar la foto.')

      // Merge the photo IDs data with the new delivery data.
      updateData = mergeWithDelivery(data, uploadedPhotoKey, uploadedThumbnailKey, user)
    } else if (data.deliveryStatus === '3') {
      updateData = normalizeForCancelDelivery(data, user)
    } else if (data.deliveryStatus === '1') {
      if (!data.carrier) throw createError('El carrier no puede esta vacio.')

      updateData = data
    } else {
      if (data.email) {
        data.email = data.email?.toLowerCase()
      }

      if (data.phone) {
        data.phone = toPhone(data.phone)
      }

      await validateBeneficiary(data)
      updateData = normalize(data)
    }

    return beneficiaries.updateById(id, updateData)
  }

  const normalizeForCancelDelivery = (data, user) => {
    const beneficiaryData = {}
    beneficiaryData.deliveredBy = user._id
    beneficiaryData.deliveryStatus = '3'
    beneficiaryData.status = '4'
    beneficiaryData.updatedAt = data.updateAt || Date.now()
    return beneficiaryData
  }

  const mergeWithDelivery = (data, uploadedPhotoKey, uploadedThumbnailKey, user) => {
    const beneficiaryData = {}

    if (
      uploadedPhotoKey !== null &&
      uploadedPhotoKey !== undefined &&
      uploadedThumbnailKey !== null &&
      uploadedThumbnailKey !== undefined
    ) {
      beneficiaryData.photo = uploadedPhotoKey
      beneficiaryData.thumbnail = uploadedThumbnailKey
      beneficiaryData.deliveredBy = user._id
      beneficiaryData.deliveryStatus = '2'
      beneficiaryData.status = '4'
      beneficiaryData.updatedAt = data.updateAt || Date.now()
    } else throw createError('La foto y thumbnail no pueden estar vacillos.')

    return beneficiaryData
  }

  const destroy = async ({ user, id }) => {
    user.can('delete', 'beneficiary', { _id: id })

    const beneficiaries = await db.get('beneficiaries')
    const doc = await beneficiaries.deleteById(id)
    if (!doc) throw createError(400, 'No se pudo eliminar al beneficiario')
    return { _id: id }
  }

  const validateBeneficiary = async (data) => {
    if (data.docId && !isString(data.docId)) throw createError('Id inválido')
    if (!isEmail(data.email)) throw createError('Email inválido')
    if (data.id && !isString(data.id)) throw createError('Id inválido')
    if (data.name && !isString(data.name)) throw createError('Nombre inválido')
    if (data.phone && !isString(data.phone)) throw createError('Teléfono inválido')
    if (data.address && !isString(data.address)) throw createError('Dirección inválida')
    if ('province' in data && !isProvince(data.province)) throw createError('Provincia inválida')
    if ('canton' in data && !isCanton(data.canton)) throw createError('Cantón inválido')
    if ('district' in data && !isDistrict(data.district)) throw createError('Distrito inválido')
    if (data.address && !isString(data.necesities))
      throw createError('Campo de necesidades del beneficiario inválido')

    return true
  }

  setIndexes().catch(console.log)
  return { fetch, create, update, destroy, fields }
}
