import en from '../translations/en.json'
import * as locales from './locales'

const defaultLocale = locales.get() || 'es'
const state = { db: {}, locale: defaultLocale }

const getKey = (tpl) => {
  const key = (acc, str, i) => `${str}\${${i}}${acc}`
  return tpl
    .slice(0, -1)
    .reduceRight(key, tpl[tpl.length - 1])
    .replace(/\r\n/g, '\n')
}

const i18n = (tpl, ...values) => {
  const key = getKey(tpl)
  const db = (state.db || {})[state.locale] || {}
  const str = db[key]

  if (!str) {
    const out = [tpl[0]]
    for (let i = 0, l = values.length; i < l; ++i) {
      out.push(values[i], tpl[i + 1])
    }

    return out.join('')
  }

  return str.replace(/\${(\d)}/g, (_, i) => values[Number(i)])
}

i18n.set = async (locale, force) => {
  if (force || locale) {
    state.db = state.db || {}

    if (force || !state.db[locale]) {
      switch (locale) {
        case 'en':
          state.db[locale] = en
          break
        default:
          break
      }
    }

    state.locale = locale
    locales.set(locale)
  }
}

i18n.set(defaultLocale, true)
i18n.state = state

export default i18n
