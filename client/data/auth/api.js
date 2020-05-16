import { get, post, del } from '../../lib/api'

export const verify = (data = {}) => get(`/verify`, data)
export const signin = (data = {}) => post('/auth', data)
export const signout = (data = {}) => del('/auth', data)
