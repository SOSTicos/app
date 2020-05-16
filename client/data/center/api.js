import { get, post, patch, del } from '../../lib/api'
import { toId } from '../../lib/utils'

export const create = (data = {}) => post('/centers', data)
export const fetch = ({ id, ...data } = {}) => get(`/centers${toId(id)}`, data)
export const update = ({ id, ...data } = {}) => patch(`/centers${toId(id)}`, data)
export const destroy = ({ id, ...data } = {}) => del(`/centers${toId(id)}`, data)
