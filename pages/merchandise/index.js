import { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { lighten, makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import GridList from '@material-ui/core/GridList'
import { useRouter } from 'next/router'
import ButtonLink from '../../client/components/button-link'
import Layout from '../../client/components/layout'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import * as api from '../../client/lib/api'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info'
import { Link } from '@material-ui/core'

const DefaultThumbnail = '/icon.png'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },

  chip: {
    backgroundColor: lighten(theme.palette.primary.main, 0.9),
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
  },
}))

const MerchandiseList = ({ user, merchandise = [], host }) => {
  const router = useRouter()
  const styles = useStyles()

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const data = merchandise

  const renderItem = (item) => {
    const thumbnailUrl = item.thumbnail
      ? `${host}/api/merchandise/thumbnail?id=${encodeURIComponent(item.thumbnail)}`
      : DefaultThumbnail

    const description = `${isoStringToDateFormat(item.arrivalDate)}`

    return (
      <Paper key={item._id} style={{ marginBottom: 10 }}>
        <GridListTile key={thumbnailUrl} style={{ height: 200 }}>
          <Link href={`/merchandise/${item._id}`}>
            <div height="200">
              <img width="100%" src={thumbnailUrl} alt="No thumbnail" />
            </div>
          </Link>
          <GridListTileBar
            titlePosition="bottom"
            title="Recibido:"
            subtitle={description}
            actionIcon={
              <IconButton className={styles.icon}>
                <InfoIcon />
              </IconButton>
            }
          />
        </GridListTile>
      </Paper>
    )
  }

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
        Donativos
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={3}
        marginBottom={3}
      >
        <ButtonLink
          size="small"
          className={styles.button}
          fullWidth={false}
          href="/merchandise/reception"
          variant="text"
        >
          <AddCircleIcon style={{ marginRight: 8 }} />
          Crear
        </ButtonLink>
      </Box>
      <GridList cellHeight={200} spacing={15} cols={2}>
        {data.map((item) => renderItem(item))}
      </GridList>
      <List className={styles.root}></List>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const headers = getHeaders(ctx)
  const host = getHost(ctx)

  const merchandiseQuery = {
    centerId: session.user.centerId,
  }

  let merchandise = []

  try {
    merchandise = await api.get(`${host}/api/merchandise`, merchandiseQuery, { headers })
  } catch (_) {}

  return { props: { ...session, merchandise, host } }
}

export default MerchandiseList
