import { Fragment, useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import Layout from '../client/components/layout'
import Button from '../client/components/button'
import useApi from '../client/hooks/api'
import { getSession } from '../client/lib/auth'

const useStyles = makeStyles(() => ({
  inline: {
    justifyContent: 'space-between',
  },
  number: {},

  logo: {
    marginTop: 120,
    marginBottom: 80,
  },
}))

const Signin = () => {
  const { enqueueSnackbar: notify } = useSnackbar()
  const { isAuth, code, verifying, expired, signin, cancel } = useApi()
  const [email, setEmail] = useState('')
  const router = useRouter()
  const styles = useStyles()

  useEffect(() => {
    if (isAuth) router.replace('/')
  }, [isAuth])

  const onSubmit = async () => {
    try {
      await signin(email)
    } catch (error) {
      console.log('error', error)
      notify('Correo inválido', { variant: 'error' })
    }
  }

  const onChange = (event) => {
    setEmail(event.target.value)
  }

  return (
    <Layout noAppbar mx={4} my={10}>
      <Typography className={styles.logo} component="div" align="center" gutterBottom>
        <img style={{ width: 200 }} src="/logo.png" alt="Logo SOS Ticos" />
      </Typography>

      {verifying ? (
        <Fragment>
          <Typography variant="h2" gutterBottom align="center">
            Confirma tu correo electrónico
          </Typography>

          <Typography gutterBottom align="center">
            Te hemos enviamos un correo a
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom align="center">
            {email}
          </Typography>

          <Typography gutterBottom align="center">
            Verifique que el código de seguridad en el correo coincida con el siguiente:
          </Typography>

          <Typography
            style={{
              marginTop: 20,
              border: '1px dashed #CCC',
              borderRadius: 6,
              backgroundColor: '#FFF',
            }}
            variant="h4"
            color="primary"
            gutterBottom
            align="center"
          >
            {code}
          </Typography>
          <br />
          <Typography gutterBottom align="center">
            Esperando confirmación...
          </Typography>

          <Button size="small" variant="text" onClick={cancel}>
            Cancelar
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <Typography variant="h2" gutterBottom align="center">
            Email
          </Typography>

          {expired && (
            <Typography variant="h6" color="secondary" gutterBottom align="center">
              Tu verificación ha expirado
            </Typography>
          )}

          <FormGroup>
            <FormGroup className={styles.inline} row>
              <TextField
                fullWidth
                defaultValue={email || ''}
                className={styles.number}
                variant="outlined"
                onChange={onChange}
              />
            </FormGroup>
          </FormGroup>

          <Button onClick={onSubmit}>{expired ? 'Reintentar' : 'Ingresar'}</Button>
        </Fragment>
      )}
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default Signin
