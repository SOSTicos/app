const isEmail = require('is-email');
const { pick, isString } = require('lodash');
const { createError } = require('../lib/utils');
const { isProvince, isCanton, isDistrict } = require('../../shared/lib/locations');
const { isPhone, toPhone } = require('../../shared/lib/utils');

module.exports = ({ db, superadmin, seed }) => {
    const fields = [
        'name',
        'phone',
        'email',
        'docId',
        'centerId',
        'address',
        'province',
        'canton',
        'district',
        'necesities',
        'status'
    ];

    const setIndexes = async () => {
        const beneficiaries = await db.get('beneficiaries');
        beneficiaries.createIndex({ id: 1, unique: 1});
    };
    
    const normalize = (data) => {
        return {
            docId: data.docId,
            centerId: data.centerId,
            name: data.name,
            phone: data.phone ? toPhone(data.phone) : null,
            email: data.email.toLowerCase(),
            address: data.address,
            province: data.province,
            canton: data.canton,
            necesities: data.necesities,
            district: data.district,
            status: data.status,
            updatedAt: data.updateAt || Date.now(),
            createdAt: data.createdAt || Date.now(),
        }
    };

    const fetch = async ({ user, id, ...query}) => {
        user.can('read', 'beneficiary', { _id: id});
        const beneficiaries = await db.get('beneficiaries');
        const res = id ? await beneficiaries.findById(id) : await beneficiaries.findMany(query);
        if(!res)
            throw createError('No se encontró el beneficiario', 404);
        return res;
    }

    const create = async ({ user, ...data }) => {
        if(user) user.can('create', 'beneficiary');

        const beneficiaries = await db.get('beneficiaries');

        if(await beneficiaries.findOne({ docId: data.docId }))
            throw createError('Este beneficiario ya existe');
        await validateBeneficiary(data, beneficiaries);

        data = normalize(data);
        return beneficiaries.insertOne(data);
    }

    const update = async ({ user, id, userId, ...data }) => {
        user.can('update', 'beneficiary', { beneficiaryId: id })
        const beneficiaries = await db.get('beneficiaries');

        data = pick(data, fields)

        await validateBeneficiary(data, beneficiaries);

        if (data.email) {
            data.email = data.email.toLowerCase()
        }

        if (data.phone) {
            data.phone = toPhone(data.phone)
        }

        if (userId) {
            data.userId = userId
        }

        data.updatedAt = Date.now()

        return beneficiaries.updateById(id, data)
    }

    const destroy = async ({ user, id }) => {
        user.can('delete', 'beneficiary', {_id: id});
        
        const beneficiaries = await db.get('beneficiaries');
        const doc = await beneficiaries.deleteById(id);
        if(!doc) throw createError(400, 'No se pudo eliminar al beneficiario');
        return {_id: id};
    }

    const validateBeneficiary = async ( data, beneficiaries ) => {
        if (data.docId && !isString(data.docId))
            throw createError('Id inválido');
        if(!isEmail(data.email))
            throw createError('Email inválido');
        if(data.id && !isString(data.id))
            throw createError('Id inválido');
        if(data.name && !isString(data.name))
            throw createError('Nombre inválido');
        if(data.phone && !isString(data.phone))
            throw createError('Teléfono inválido');
        if(data.address && !isString(data.address))
            throw createError('Dirección inválida');
        if ('province' in data && !isProvince(data.province))
            throw createError('Provincia inválida');
        if ('canton' in data && !isCanton(data.canton))
            throw createError('Cantón inválido');
        if ('district' in data && !isDistrict(data.district))
            throw createError('Distrito inválido');
        if(data.address && !isString(data.necesities))
            throw createError('Necesities inválido');
        
        return true;
    }

    setIndexes().catch(console.log);
    return { fetch, create, update, destroy, fields};
}