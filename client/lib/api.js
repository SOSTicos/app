import request from './request'

let token = undefined

export const setToken = (accessToken) => {
  token = accessToken
}

export const unsetToken = () => {
  token = undefined
}

export const get = (path, query, options = {}) => {
  return request({ path, query, method: 'GET', token, ...options })
}

export const post = (path, body, options = {}) => {
  return request({ path, method: 'POST', body, token, ...options })
}

export const put = (path, body, options = {}) => {
  return request({ path, method: 'PUT', body, token, ...options })
}

export const patch = (path, body, options = {}) => {
  return request({ path, method: 'PATCH', body, token, ...options })
}

export const del = (path, body, options = {}) => {
  return request({ path, method: 'DELETE', body, token, ...options })
}
