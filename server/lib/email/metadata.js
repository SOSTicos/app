const createI18n = require('../i18n')

module.exports = ({ locale, template, ...data } = {}, { from }) => {
  const i18n = createI18n(locale)

  from = data.from || from

  const templates = {
    test: {
      title: i18n`Test`,
      from: i18n`SOS Ticos <${from}>`,
      subject: i18n`[SOS Ticos] Test`,
    },
    confirm: {
      title: i18n`Confirmation`,
      from: i18n`SOS Ticos <${from}>`,
      subject: i18n`Login Confirmation (code: "${data.code}")`,
    },
    welcome: {
      title: i18n`Welcome`,
      from: i18n`SOS Ticos <${from}>`,
      subject: i18n`Welcome to SOS Ticos`,
    },
    invite: {
      title: i18n`Invitation`,
      from: i18n`SOS Ticos <${from}>`,
      subject: i18n`You have been invited to SOS Ticos`,
    },
  }

  return templates[template] || {}
}
