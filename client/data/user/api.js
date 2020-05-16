import { get, post, patch, del } from '../../lib/api'
import { toId } from '../../lib/utils'

export const create = (data = {}) => post('/users', data)
export const fetch = ({ id, ...data } = {}) => get(`/users${toId(id)}`, data)
export const update = ({ id, ...data } = {}) => patch(`/users${toId(id)}`, data)
export const destroy = ({ id, ...data } = {}) => del(`/users${toId(id)}`, data)
