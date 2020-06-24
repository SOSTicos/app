module.exports = (locale = 'es') => {
  locale = locale.substring(0, 2)

  const getKey = (tpl) => {
    const key = (acc, string, i) => `${string}\${${i}}${acc}`
    return tpl
      .slice(0, -1)
      .reduceRight(key, tpl[tpl.length - 1])
      .replace(/\r\n/g, '\n')
  }

  const i18n = (tpl, ...values) => {
    const key = getKey(tpl)
    const db = (i18n.db || {})[i18n.locale] || {}
    const string = db[key]
    if (!string) {
      const out = [tpl[0]]
      for (let i = 0, l = values.length; i < l; ++i) {
        out.push(values[i], tpl[i + 1])
      }

      return out.join('')
    }

    return string.replace(/\${(\d)}/g, (_, i) => values[Number(i)])
  }

  i18n.set = (locale) => {
    if (!locale) return
    i18n.db = i18n.db || {}

    if (!i18n.db[locale]) {
      i18n.db[locale] = require(`../../shared/translations/${locale}.json`)
    }

    i18n.locale = locale
  }

  i18n.set(locale)

  return i18n
}
