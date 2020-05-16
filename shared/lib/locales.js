// import getBrowserLocale from 'browser-locale'
import * as cookies from './cookies'

export const get = (ctx) => {
  return cookies.get('locale', ctx) || 'es'
}

export const set = (locale, ctx) => {
  cookies.set('locale', locale, ctx)
}
