import { get, post, patch, del } from '../../lib/api'
import { toId } from '../../lib/utils'

export const create = (data = {}) => post('/beneficiaries', data)
export const fetch = ({ id, ...data } = {}) => get(`/beneficiaries${toId(id)}`, data)
export const update = ({ id, ...data } = {}) => patch(`/beneficiaries${toId(id)}`, data)
export const destroy = ({ id, ...data } = {}) => del(`/beneficiaries${toId(id)}`, data)
