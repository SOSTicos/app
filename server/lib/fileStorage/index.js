'use strict'

const AWS = require('aws-sdk')
const { createError } = require('../utils')

module.exports = (options) => {
  const { aws } = options
  const { accessKey, secretKey, region } = aws

  const s3 = new AWS.S3({
    region,
    apiVersion: '2006-03-01',
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  })

  async function upload(key, data) {
    if (!key || !data) {
      throw new Error('Missing key and data to upload to S3')
    }

    let uploadParameters
    try {
      uploadParameters = b64ToAWS(key, data)

      await new Promise((resolve, reject) => {
        s3.upload(uploadParameters, function (err, data) {
          if (err) {
            console.error(err)
            reject(new Error('Could not upload image to store'))
          } else if (data) {
            console.log('Successfully uploaded image', data.Location)
            resolve(data.Location)
          }
        })
      })
    } catch (error) {
      throw createError(error)
    }

    return uploadParameters.Key
  }

  async function thumbnail(key) {
    // TODO: Define bucket name
    const params = {
      Bucket: 'rodyce.sos.ticos',
      Key: key,
    }
    return s3.getObject(params)
  }

  function b64ToAWS(key, b64) {
    try {
      const dataPrefix = 'data:'
      let [contentType, imgB64] = b64.split(';base64,')

      if (contentType.startsWith(dataPrefix)) {
        contentType = contentType.slice(dataPrefix.length)
      }

      const imgBlob = Buffer.from(imgB64, 'base64')

      // TODO: Specify final bucket name
      return {
        Bucket: 'rodyce.sos.ticos',
        Body: imgBlob,
        ContentType: contentType,
        Key: key,
      }
    } catch (error) {
      console.error(error)
      throw new Error('Invalid photo/image data')
    }
  }

  return { upload, thumbnail }
}
