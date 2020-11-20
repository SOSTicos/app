import { Fragment, useEffect, useState } from 'react'
import { isEmpty, find, isNil, omitBy } from 'lodash'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import EditIcon from '@material-ui/icons/Edit'
import ClearIcon from '@material-ui/icons/Clear'
import Layout from '../../client/components/layout'
import Autocomplete from '../../client/components/autocomplete'
import Button from '../../client/components/button'
import Input from '../../client/components/input'
import Line from '../../client/components/line'
import Select from '../../client/components/select'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import useApi from '../../client/hooks/api'
import * as api from '../../client/lib/api'
import i18n from '../../shared/lib/i18n'
import { toPhone } from '../../shared/lib/utils'
import { provincias, cantones, distritos, all } from '../../shared/lib/locations'

const roles = [
  { value: 'superadmin', label: i18n`Super Administrador` },
  { value: 'admin', label: i18n`Administrador` },
  { value: 'coordinator', label: i18n`Coordinador` },
  { value: 'carrier', label: i18n`Transportista` },
  { value: 'member', label: i18n`Miembro` },
]

const useStyles = makeStyles((theme) => ({
  inline: {
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  inlineControl: {
    width: '48%',
  },
  button: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    // backgroundColor: lighten(theme.palette.primary.main, 0.9),
  },
  paper: {
    padding: 28,
  },
}))

const VolunteerDetail = ({ user, data, centers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const [editting, setEditting] = useState(false)
  const router = useRouter()
  const styles = useStyles()
  const api = useApi()
  const userId = data._id

  const { enqueueSnackbar: notify } = useSnackbar()

  const { watch, setValue, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: data?.role || '',
      name: data?.name || '',
      docId: data?.docId || '',
      email: data?.email || '',
      phone: (data?.phone || '').replace('+506', ''),
      province: data?.province || '',
      canton: data?.canton || '',
      district: data?.district || '',
      address: data?.address || '',
      center: data?.centerId ? find(centers, { _id: data?.centerId }) : {},
    },
  })

  const center = data?.centerId ? find(centers, { _id: data?.centerId }) : {}
  const { province, canton, district } = watch()
  const provinces = Object.keys(all)
  const cantons = province ? Object.keys(all[province] || {}) : []
  const districts = cantons.length > 0 ? Object.keys(all[province][canton] || {}) : []

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  // useEffect(() => {
  //   if (province && !provinces.includes(province)) {
  //     setValue('province', '')
  //   }
  // }, [provinces, province])

  useEffect(() => {
    if (canton && !cantons.includes(canton)) {
      setValue('canton', '')
    }
  }, [cantons, canton])

  useEffect(() => {
    if (district && !districts.includes(district)) {
      setValue('district', '')
    }
  }, [districts, district])

  const normalize = (data) => {
    return {
      name: data.name,
      role: data.role,
      docId: data.docId,
      phone: data.phone ? toPhone(data.phone) : undefined,
      province: data.province,
      canton: data.canton,
      district: data.district,
      address: data.address,
      centerId: data?.center?._id,
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      data = normalize(data)
      await api.users.update({ ...data, id: userId })
      notify(i18n`Voluntario actualizado`, { variant: 'success' })
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo actualizar el voluntario`, { variant: 'error' })
    } finally {
      setSubmitting(false)
      setEditting(false)
    }
  }

  const onToggleEdit = () => {
    setEditting((editting) => !editting)
  }

  const role = roles.find((role) => data.role === role.value)

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Voluntario`}
      </Typography>
      <Box display="flex" justifyContent="flex-end">
        <Button
          size="small"
          className={styles.button}
          fullWidth={false}
          variant="text"
          onClick={onToggleEdit}
        >
          {editting ? (
            <ClearIcon style={{ marginRight: 8 }} />
          ) : (
            <EditIcon style={{ marginRight: 8 }} />
          )}
          {editting ? i18n`Cancelar` : i18n`Editar`}
        </Button>
      </Box>

      {editting ? (
        <Fragment>
          <Input disabled name="email" control={control} label={i18n`Email`} />
          <Input
            name="name"
            label={i18n`Nombre`}
            rules={{ required: i18n`Requerido` }}
            control={control}
            error={Boolean(errors.name)}
            errorText={errors.name && errors.name.message}
          />

          <Input
            name="docId"
            control={control}
            label={i18n`Cédula`}
            error={Boolean(errors.docId)}
            errorText={errors.docId && errors.docId.message}
          />

          <Input
            name="phone"
            control={control}
            label={i18n`Teléfono`}
            error={Boolean(errors.phone)}
            errorText={errors.phone && errors.phone.message}
          />

          <Select
            name="province"
            control={control}
            label={i18n`Provincia`}
            rules={{ required: i18n`Requerido` }}
            error={Boolean(errors.province)}
            errorText={errors.province && errors.province.message}
          >
            {provinces.map((code) => (
              <option key={code} value={code}>
                {provincias[code]}
              </option>
            ))}
          </Select>

          <FormGroup row className={styles.inline}>
            <Select
              name="canton"
              control={control}
              label={i18n`Cantón`}
              rules={{ required: i18n`Requerido` }}
              className={styles.inlineControl}
              error={Boolean(errors.canton)}
              errorText={errors.canton && errors.canton.message}
            >
              {cantons.map((code) => (
                <option key={code} value={code}>
                  {cantones[code]}
                </option>
              ))}
            </Select>
            <Select
              name="district"
              control={control}
              label={i18n`Distrito`}
              rules={{ required: i18n`Requerido` }}
              className={styles.inlineControl}
              error={Boolean(errors.district)}
              errorText={errors.district && errors.district.message}
            >
              {districts.map((code) => (
                <option key={code} value={code}>
                  {distritos[code]}
                </option>
              ))}
            </Select>
          </FormGroup>

          <Input
            type="text"
            name="address"
            control={control}
            label={i18n`Otras señas`}
            rules={{ required: i18n`Requerido` }}
            error={Boolean(errors.address)}
            errorText={errors.address && errors.address.message}
          />

          <Select
            name="role"
            control={control}
            label={i18n`Rol`}
            rules={{ required: i18n`Requerido` }}
            error={Boolean(errors.role)}
            errorText={errors.role && errors.role.message}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>

          <Autocomplete
            label={i18n`Centro de acopio`}
            name="center"
            control={control}
            options={centers}
            error={Boolean(errors.center)}
            errorText={errors.center && errors.center.message}
            rules={{ required: i18n`Requerido` }}
          />

          <Button
            style={{ marginBottom: 0 }}
            type="submit"
            loading={submitting}
            loadingText={i18n`Guardando...`}
            disabled={!isEmpty(errors)}
            onClick={handleSubmit(onSubmit)}
          >
            {i18n`Guardar`}
          </Button>
          <br />
        </Fragment>
      ) : (
        <Paper className={styles.paper}>
          <Line label={i18n`Email`} value={data.email} />
          {data.name && <Line label={i18n`Nombre`} value={data.name} />}
          {data.docId && <Line label={i18n`Cédula`} value={data.docId} />}
          {data.phone && <Line label={i18n`Teléfono`} value={data.phone} />}
          {data.province && <Line label={i18n`Provincia`} value={provincias[data.province]} />}
          {data.canton && <Line label={i18n`Cantón`} value={cantones[data.canton]} />}
          {data.district && <Line label={i18n`Distrito`} value={distritos[data.district]} />}
          {data.address && <Line label={i18n`Otras señas`} value={data.address} />}
          {center && center._id && <Line label={i18n`Centro de acopio`} value={center.name} />}
          {data.role && <Line label={i18n`Rol`} value={role.label} />}
        </Paper>
      )}
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const { id } = ctx.query

  try {
    const host = getHost(ctx)
    const headers = getHeaders(ctx)
    const data = await api.get(`${host}/api/users/${id}`, {}, { headers })
    return { props: omitBy({ ...session, data }, isNil) }
  } catch (error) {
    console.log(error)
    return { props: { ...session } }
  }
}

export default VolunteerDetail
