import { useEffect, Fragment, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { lighten, makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
// import useMediaQuery from '@material-ui/core/useMediaQuery'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import Chip from '@material-ui/core/Chip'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useRouter } from 'next/router'
import ButtonLink from '../../client/components/button-link'
import Layout from '../../client/components/layout'
import Search from '../../client/components/search'
import { getSession, getHeaders } from '../../client/lib/auth'
import createSearch from '../../client/lib/search'
import { getHost } from '../../client/lib/utils'
import * as api from '../../client/lib/api'

const ROLES = {
  admin: 'Administrador',
  member: 'Miembro',
  superadmin: 'Super Administrador',
  coordinator: 'Coordinador',
  carrier: 'Transportista',
}

const SEARCH_KEYS = ['name', 'email', 'phone', 'province', 'canton', 'district', 'role', 'docId']

const search = createSearch(SEARCH_KEYS, {
  threshold: 0.8,
  location: 10,
  distance: 15,
})

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    // backgroundColor: lighten(theme.palette.primary.main, 0.9),
  },

  chip: {
    backgroundColor: lighten(theme.palette.primary.main, 0.9),
    color: theme.palette.primary.main,
    fontWeight: '600',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
  },
}))

const VolunteerList = ({ user, users = [] }) => {
  const router = useRouter()
  const styles = useStyles()
  const [keyword, setKeyword] = useState()
  // const [type, setType] = useState('')
  // const matches = useMediaQuery('(min-width:400px)')

  useEffect(() => {
    if (!user) router.replace('/signin')
    // Return all non admin users to home
    if (!['superadmin', 'admin'].includes(user.role)) router.replace('/')
  }, [user])

  const onSearch = async (keyword) => {
    setKeyword(keyword)
  }

  const data = keyword ? search(users, keyword) : users

  const renderItem = (item) => {
    const role = ROLES[item.role]

    return (
      <Paper key={item._id} style={{ marginBottom: 16 }}>
        <ListItem button onClick={() => router.push(`/volunteers/${item._id}`)}>
          <ListItemText
            primaryTypographyProps={{ component: 'div' }}
            primary={
              <Box display="flex" justifyContent="space-between">
                <Typography gutterBottom>{item.email}</Typography>
              </Box>
            }
            secondaryTypographyProps={{ component: 'div' }}
            secondary={
              <Fragment>
                <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                  <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <Typography>{item.name}</Typography>
                    <Typography color="secondary">
                      {item.phone ? item.phone : 'Sin Teléfono'}
                    </Typography>
                  </Box>
                  <Chip className={styles.chip} label={role} color="primary" size="small" />
                </Box>
              </Fragment>
            }
          />
        </ListItem>
      </Paper>
    )
  }

  console.log(keyword, data)

  return (
    <Layout user={user} my={0} mx={1}>
      <Typography variant="h1" gutterBottom>
        Voluntarios
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={3}
        marginBottom={3}
      >
        <Search onSearch={onSearch} />
        <ButtonLink
          size="small"
          className={styles.button}
          fullWidth={false}
          href="/volunteers/create"
          variant="text"
        >
          <AddCircleIcon style={{ marginRight: 8 }} />
          Crear
        </ButtonLink>
      </Box>
      <List className={styles.root}>{data.map((item) => renderItem(item))}</List>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const headers = getHeaders(ctx)
  const host = getHost(ctx)

  let users = []

  try {
    users = session.user ? await api.get(`${host}/api/users`, {}, { headers }) : []
  } catch (_) {}

  return { props: { ...session, users } }
}

export default VolunteerList
