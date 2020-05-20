import fetch from 'isomorphic-unfetch'
import { getHost } from '../../shared/lib/utils'
import * as qs from './qs'

export default async ({ path, method = 'GET', token, body, query, headers = {} }) => {
  const requestHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  }

  if (token && !headers.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  try {
    body = body ? JSON.stringify(body) : body
  } catch (error) {
    console.error(error)
  }

  let url = /https?/.test(path) ? path : `${getHost()}/api${path}`

  if (query && Object.keys(query).length > 0) {
    url += (url.includes('?') ? '&' : '?') + qs.format(query)
  }

  console.log('URL', url, method, body, token)

  try {
    const response = await fetch(url, {
      body,
      method,
      headers: requestHeaders,
    })

    const type = requestHeaders['Content-Type']

    if (response.status >= 200 && response.status < 300) {
      return type.includes('text') ? response.text() : response.json()
    }

    if (response.status === 401) {
      throw new Error('Unauthorized')
    }

    const error = await response.json()
    throw new Error(error.message || response.statusText)
  } catch (error) {
    console.log('ERROR', error)
    throw error
  }
}
