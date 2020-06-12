import { get, post, patch, del } from '../../lib/api'
import { toId } from '../../lib/utils'

export const create = (data = {}) => post('/merchandise', data)
export const fetch = ({ id, ...data } = {}) => get(`/merchandise${toId(id)}`, data)
export const update = ({ id, ...data } = {}) => patch(`/merchandise${toId(id)}`, data)
export const destroy = ({ id, ...data } = {}) => del(`/merchandise${toId(id)}`, data)
