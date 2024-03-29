const { isFunction, isObject } = require('lodash')
const { Ability, AbilityBuilder, subject } = require('@casl/ability')
const { createError } = require('./utils')

// Resource name is defined here and used in other files
// Doesn't need to match the mongoDB naming
const permissions = {
  member({ _id }, { can }) {
    can('update', 'user', { _id })
    can('read', 'user', { _id })
    can('read', 'center')
  },
  beneficiary({ _id }, { can }) {
    can('update', 'user', { _id })
    can('read', 'user', { _id })
    can('read', 'center')
  },
  carrier({ _id, carrier }, { can }) {
    can('update', 'user', { _id })
    can('read', 'user')
    can('read', 'center')
    can('read', 'beneficiary', { carrier })
    can('update', 'beneficiary', { carrier })
  },
  coordinator({ _id, centerId, carrier }, { can }) {
    can('read', 'user')
    can('update', 'user', { _id })
    can('read', 'center')
    can('read', 'merchandise')
    can('create', 'merchandise')
    can('create', 'beneficiary')
    can('read', 'beneficiary', { carrier })
    can('update', 'beneficiary', { carrier })
    can('read', 'beneficiary', { centerId })
    can('update', 'beneficiary', { centerId })
  },
  admin(_, { can }) {
    can('manage', 'all')
  },
  superadmin(_, { can }) {
    can('manage', 'all')
  },
}

/**
 * Create rules.
 *
 * @param {Object} user
 * @return {Array} rules
 * @type public
 */

const createRules = (user) => {
  const builder = new AbilityBuilder(Ability)

  if (isFunction(permissions[user.role])) {
    permissions[user.role](user, builder)
  } else {
    throw createError(`Rol "${user.role}" inválido`)
  }

  return builder.build()
}

/**
 * Cast properties.
 *
 * @param {Object} data
 * @return {Object} data
 * @type public
 */

const cast = (data) => {
  if (!data || !isObject(data)) return

  if (data._id) {
    data = { ...data, _id: String(data._id) }
  }

  if (data.centerId) {
    data = { ...data, centerId: String(data.centerId) }
  }

  return data
}

/**
 * Create acl.
 *
 * @param {Object} user
 * @return {Object} acl
 * @type public
 */

const createACL = (user) => {
  const ability = createRules(user)

  const can = (action, resource, data = {}, error = true) => {
    const ok = ability.can(action, subject(resource, cast(data)))
    if (error && !ok) throw createError('Permisos insuficientes', 403)
    return ok
  }

  const cant = (action, resource, data = {}) => {
    return ability.cannot(action, subject(resource, cast(data)))
  }

  user.can = can
  user.cant = cant

  return { can, cant, ability }
}

module.exports = createACL
