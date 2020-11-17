import { Fragment, useEffect, useState } from 'react'
import { isEmpty, find } from 'lodash'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import EditIcon from '@material-ui/icons/Edit'
import ClearIcon from '@material-ui/icons/Clear'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Layout from '../client/components/layout'
import Button from '../client/components/button'
import Input from '../client/components/input'
import Line from '../client/components/line'
import { getSession } from '../client/lib/auth'
import useApi from '../client/hooks/api'
import i18n from '../shared/lib/i18n'
import * as tokens from '../shared/lib/tokens'
import { sleep } from '../client/lib/utils'

const useStyles = makeStyles((theme) => ({
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

const Profile = ({ user, centers = [] }) => {
  const [submitting, setSubmitting] = useState(false)
  const [editting, setEditting] = useState(false)
  const styles = useStyles()
  const router = useRouter()
  const api = useApi()
  const { enqueueSnackbar: notify } = useSnackbar()

  const { watch, control, handleSubmit, errors } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: user?.role || '',
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      center: user?.centerId ? find(centers, { _id: user?.centerId })?.name || '' : '',
    },
  })

  const center = find(centers, { _id: user?.centerId }) || {}
  // const center = user?.centerId ? find(centers, { _id: user?.centerId })? || '' : ''

  const { docId } = watch()

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const normalize = (data) => {
    return {
      name: data.name,
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      await api.me.update(normalize(data))
      notify(i18n`Perfil actualizado`, { variant: 'success' })
    } catch (error) {
      console.log(error)
      notify(i18n`No se pudo actualizar su perfil`, { variant: 'error' })
    } finally {
      setSubmitting(false)
      setEditting(false)
    }
  }

  const testSnack = () => {
    notify(`Mensaje de ejemplo dismiss`, { variant: 'success' })
  }

  const onExit = async () => {
    tokens.del()
    await sleep(1000)
    window.location = '/'
  }

  const onToggleEdit = () => {
    setEditting((editting) => !editting)
  }

  return (
    <Layout
      user={user}
      backLabel="Inicio"
      onBack={() => router.replace('/dashboard')}
      my={0}
      mx={2}
    >
      <Typography variant="h1" gutterBottom>
        {i18n`Perfil`}
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
          <Input disabled name="email" control={control} label={i18n`Email`} />
          <Input
            name="name"
            label={i18n`Nombre`}
            control={control}
            error={Boolean(errors.name)}
            errorText={errors.name && errors.name.message}
          />
          {docId && (
            <Input
              name="docId"
              control={control}
              label={i18n`Cédula`}
              error={Boolean(errors.docId)}
              errorText={errors.docId && errors.docId.message}
            />
          )}

          <Input disabled name="role" control={control} label={i18n`Rol`} />

          <Input
            disabled
            name="center"
            control={control}
            placeholder={i18n`Ninguno`}
            label={i18n`Centro de acopio`}
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
          <Line label={i18n`Email`} value={user.email} />
          <Line label={i18n`Nombre`} value={user.name} />
          <Line label={i18n`Cédula`} value={user.docId} />
          <Line label={i18n`Teléfono`} value={user.phone} />
          <Line label={i18n`Rol`} value={user.role} />
          <Line label={i18n`Centro de acopio`} value={center.name} />
          <Button variant="outlined" color="secondary" onClick={testSnack}>
            mostrar snack
          </Button>
        </Paper>
      )}
      <Button variant="outlined" color="secondary" onClick={onExit}>
        {i18n`Cerrar sesión`}
      </Button>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default Profile
