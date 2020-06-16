import * as api from './api'

export const fetch = async (data) => {
  return api.fetch(data)
}

export const create = async (data) => {
  return api.create(data)
}

export const update = async (data) => {
  return api.update(data)
}

export const destroy = async (data) => {
  return api.destroy(data)
}
