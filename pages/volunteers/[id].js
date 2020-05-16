import { Fragment, useEffect, useState } from 'react'
import { isEmpty, find, isNil, omitBy } from 'lodash'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
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

const useStyles = makeStyles((theme) => ({
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

  const { watch, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: data?.role || '',
      name: data?.name || '',
      docId: data?.docId || '',
      email: data?.email || '',
      phone: (data?.phone || '').replace('+506', ''),
      center: data?.centerId ? find(centers, { _id: data?.centerId }) : {},
    },
  })

  const center = data?.centerId ? find(centers, { _id: data?.centerId }) : {}

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const normalize = (data) => {
    return {
      name: data.name,
      role: data.role,
      docId: data.docId,
      centerId: data?.center?._id,
    }
  }

  const onSubmit = async (data) => {
    console.log('DATA', data)
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

          <Select
            name="role"
            control={control}
            label={i18n`Rol`}
            rules={{ required: i18n`Requerido` }}
            error={Boolean(errors.role)}
            errorText={errors.role && errors.role.message}
          >
            <option value="admin">{i18n`Administrador`}</option>
            <option value="coordinator">{i18n`Coordinador`}</option>
            <option value="carrier">{i18n`Transportista`}</option>
            <option value="member">{i18n`Miembro`}</option>
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
        </Fragment>
      ) : (
        <Paper className={styles.paper}>
          <Line label={i18n`Email`} value={data.email} />
          <Line label={i18n`Nombre`} value={data.name} />
          <Line label={i18n`Cédula`} value={data.docId} />
          <Line label={i18n`Teléfono`} value={data.phone} />
          <Line label={i18n`Rol`} value={data.role} />
          <Line label={i18n`Centro de acopio`} value={center.name} />
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
  } catch (_) {
    console.log(_)
    return { props: { ...session } }
  }
}

export default VolunteerDetail
