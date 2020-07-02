import { useEffect } from 'react'
import { isNil, omitBy } from 'lodash'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Layout from '../../client/components/layout'
import Button from '../../client/components/button'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import * as api from '../../client/lib/api'
import i18n from '../../shared/lib/i18n'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
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
    padding: 10,
  },
  icon: {
    marginRight: 8,
  },
}))

const MerchandiseDetail = ({ user, data, photoUrl }) => {
  const router = useRouter()
  const styles = useStyles()

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  function isoStringToDateFormat(isoDate) {
    const date = new Date(isoDate)
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let dt = date.getDate()

    if (dt < 10) {
      dt = '0' + dt
    }
    if (month < 10) {
      month = '0' + month
    }

    return `${dt}/${month}/${year}`
  }

  return (
    <Layout user={user} backLabel="Volver" onBack={() => router.back()} my={0} mx={2}>
      <Typography variant="h1" gutterBottom>
        {i18n`Detalles de Donativo`}
      </Typography>

      <Paper className={styles.paper}>
        <img src={photoUrl} width="100%" alt="Donativo" />
        <Typography gutterBottom variant="h5" component="h2">
          Recibido: {isoStringToDateFormat(data.arrivalDate)}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {data.description}
        </Typography>
      </Paper>

      <Button size="small" color="primary" onClick={() => router.back()}>
        Aceptar
      </Button>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const { id } = ctx.query

  try {
    const host = getHost(ctx)
    const headers = getHeaders(ctx)
    const data = await api.get(`${host}/api/merchandise/${id}`, {}, { headers })
    const photoUrl = data.photo
      ? `${host}/api/merchandise/thumbnail?id=${encodeURIComponent(data.photo)}`
      : '/icon.png'

    return { props: omitBy({ ...session, data, photoUrl }, isNil) }
  } catch (_) {
    return { props: { ...session } }
  }
}

export default MerchandiseDetail
