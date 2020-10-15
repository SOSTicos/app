'use strict'

const { htmlToText } = require('nodemailer-html-to-text')
const { createTransport } = require('nodemailer')
const AWS = require('aws-sdk')
const { isString } = require('lodash')
const { createError } = require('../utils')
const templates = require('../templates')
const getMetadata = require('./metadata')

module.exports = (options) => {
  const { host, site, aws } = options
  const { accessKey, secretKey, region } = aws

  const ses = new AWS.SES({
    region,
    apiVersion: '2010-12-01',
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  })

  const client = createTransport({ SES: ses, sendingRate: 1 })
  client.use('compile', htmlToText())

  const send = async (data) => {
    // if (!templates) {
    //   templates = await readTemplates()
    // }

    let { to, attachments = [] } = data

    to = to || data.email

    if (!isString(data.template)) {
      throw createError('Invalid template.')
    }

    const template = templates[data.template]

    if (!template) {
      throw createError('Template not found.')
    }

    const { layout } = templates

    if (!layout) {
      throw createError('Invalid template layout.')
    }

    const metadata = getMetadata(data, options)

    if (!metadata) {
      throw createError('Invalid template metadata')
    }

    console.log('DATA', data)

    const year = new Date().getFullYear()
    const { from, title, subject } = metadata
    const content = template({ ...data, host, site })
    const html = layout({ title, content, host, site, year })

    return client.sendMail({ html, from, to, subject, attachments })
  }

  return { send }
}
