import { Fragment, useEffect, useState } from 'react'
import { isEmpty, isNil, omitBy } from 'lodash'
import isEmail from 'is-email'
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
import Button from '../../client/components/button'
import Line from '../../client/components/line'
import Input from '../../client/components/input'
import Select from '../../client/components/select'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import useApi from '../../client/hooks/api'
import * as api from '../../client/lib/api'
import { provincias, cantones, distritos, all } from '../../shared/lib/locations'
import { isPhone, toPhone } from '../../shared/lib/utils'
import i18n from '../../shared/lib/i18n'

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
  },
  paper: {
    padding: 28,
  },
  icon: {
    marginRight: 8,
  },
}))

const CenterDetail = ({ user, data }) => {
  const [submitting, setSubmitting] = useState(false)
  const [editting, setEditting] = useState(false)
  const router = useRouter()
  const styles = useStyles()
  const api = useApi()
  const userId = data._id
  const { enqueueSnackbar: notify } = useSnackbar()

  const { watch, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: data?.name || '',
      email: data?.email || '',
      province: data?.province || '',
      canton: data?.canton || '',
      district: data?.district || '',
      address: data?.address || '',
      phone: (data?.phone || '').replace('+506', ''),
    },
  })

  const { province, canton, district } = watch()
  const provinces = Object.keys(all)
  const cantons = province ? Object.keys(all[province] || {}) : []
  const districts = cantons.length > 0 ? Object.keys(all[province][canton] || {}) : []

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  useEffect(() => {
    if (province && !provinces.includes(province)) {
      setValue('province', '')
    }
  }, [provinces, province])

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
      ...data,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: toPhone(data.phone),
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      data = normalize(data)
      await api.users.update({ ...data, id: userId })
      notify(i18n`Centro de acopio actualizado`, { variant: 'success' })
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo actualizar el centro de acopio`, { variant: 'error' })
    } finally {
      setSubmitting(false)
      setEditting(false)
    }
  }

  const onToggleEdit = () => {
    setEditting((editting) => !editting)
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Centro de acopio`}
      </Typography>

      <Box display="flex" justifyContent="flex-end">
        <Button
          size="small"
          className={styles.button}
          fullWidth={false}
          variant="text"
          onClick={onToggleEdit}
        >
          {editting ? <ClearIcon className={styles.icon} /> : <EditIcon className={styles.icon} />}
          {editting ? i18n`Cancelar` : i18n`Editar`}
        </Button>
      </Box>

      {editting ? (
        <Fragment>
          <Input
            label={i18n`Nombre`}
            error={Boolean(errors.name)}
            errorText={errors.name && errors.name.message}
            type="text"
            name="name"
            rules={{ required: i18n`Requerido` }}
            control={control}
          />

          <Input
            label={i18n`Email`}
            error={Boolean(errors.email)}
            errorText={errors.email && errors.email.message}
            type="text"
            name="email"
            rules={{
              required: i18n`Requerido`,
              validate: (value) => isEmail(value) || i18n`Email inválido`,
            }}
            control={control}
          />

          <Input
            label={i18n`Teléfono`}
            error={Boolean(errors.phone)}
            errorText={errors.phone && errors.phone.message}
            type="number"
            name="phone"
            rules={{
              required: i18n`Requerido`,
              validate: (value) => isPhone(value, 'CR', true) || i18n`Teléfono inválido`,
            }}
            control={control}
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
        </Fragment>
      ) : (
        <Paper className={styles.paper}>
          <Line label={i18n`Nombre`} value={data.name} />
          <Line label={i18n`Email`} value={data.email} />
          <Line label={i18n`Teléfono`} value={data.phone} />
          <Line label={i18n`Provincia`} value={provincias[data.province]} />
          <Line label={i18n`Cantón`} value={cantones[data.canton]} />
          <Line label={i18n`Distrito`} value={distritos[data.district]} />
          <Line label={i18n`Otras señas`} value={data.address} />
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
    const data = await api.get(`${host}/api/centers/${id}`, {}, { headers })

    return { props: omitBy({ ...session, data }, isNil) }
  } catch (_) {
    return { props: { ...session } }
  }
}

export default CenterDetail
