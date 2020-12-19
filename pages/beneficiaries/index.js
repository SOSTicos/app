import { Fragment, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import { lighten, makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useRouter } from 'next/router'
import ButtonLink from '../../client/components/button-link'
import Layout from '../../client/components/layout'
import Search from '../../client/components/search'
import { getSession, getHeaders } from '../../client/lib/auth'
import createSearch from '../../client/lib/search'
import { getHost } from '../../client/lib/utils'
import { provincias, cantones, distritos } from '../../shared/lib/locations'
import { estados } from '../../shared/lib/statuses'
import * as api from '../../client/lib/api'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const SEARCH_KEYS = [
  'name',
  'email',
  'provinceText',
  'cantonText',
  'districtText',
  'statusText',
  'address',
  'phone',
]

const search = createSearch(SEARCH_KEYS, {
  threshold: 0.8,
  location: 10,
  distance: 15,
})

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

const BeneficiaryList = ({ user, beneficiaries = [] }) => {
  const router = useRouter()
  const styles = useStyles()
  const [keyword, setKeyword] = useState()
  const tabVal = 0

  useEffect(() => {
    if (!user) router.replace('/signin')
    // Return all non admin users to home
    if (!['superadmin', 'admin'].includes(user.role)) router.replace('/')
  }, [user])

  const onSearch = async (keyword) => {
    setKeyword(keyword)
  }

  const data = keyword ? search(beneficiaries, keyword) : beneficiaries

  const renderItem = (item) => {
    const location =
      (item?.provinceText || '') +
      ', ' +
      (item?.cantonText || '') +
      ', ' +
      (item?.districtText || '')

    return (
      <Paper key={item._id} style={{ marginBottom: 16 }}>
        <ListItem button onClick={() => router.push(`/beneficiaries/${item._id}`)}>
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
                    <Typography>{location.trim()}</Typography>
                    <Typography color="secondary">{estados[item.status] || ''}</Typography>
                  </Box>
                </Box>
              </Fragment>
            }
          />
        </ListItem>
      </Paper>
    )
  }

  const handleTabChange = () => {
    router.replace('/beneficiaries/finalizados')
  }

  return (
    <Layout user={user} my={0} mx={1}>
      <Typography variant="h1" gutterBottom>
        Beneficiarios
      </Typography>
      <Tabs
        value={tabVal}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Activos" />
        <Tab label="Finalizados" />
      </Tabs>
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
          href="/beneficiaries/create"
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

  // Create container to hold the beneficiaries.
  let beneficiariesPending = []
  let beneficiariesApproved = []
  let beneficiariesCritical = []
  let beneficiaries = []

  let querry = {};
  if(session.user && session.user.role === 'coordinator') {
    querry = {
      centerId: session.user.centerId
    }
  }

  try {
    beneficiariesPending = session.user
      ? await api.get(`${host}/api/beneficiaries`, { ...querry ,status: '0' }, { headers })
      : []
    beneficiariesApproved = session.user
      ? await api.get(`${host}/api/beneficiaries`, { ...querry ,status: '2' }, { headers })
      : []
    beneficiariesCritical = session.user
      ? await api.get(`${host}/api/beneficiaries`, { ...querry ,status: '3' }, { headers })
      : []
    beneficiaries = beneficiariesCritical.concat(beneficiariesPending).concat(beneficiariesApproved)
    beneficiaries = beneficiaries.map((b) => {
      return {
        ...b,
        provinceText: b.province ? provincias[b.province] : 'n/A',
        districtText: b.district ? distritos[b.district] : 'n/a',
        cantonText: b.canton ? cantones[b.canton] : 'n/a',
        statusText:
          b.status && b.status >= 0 && b.status < estados.length ? estados[b.status] : 'N/A',
      }
    })
  } catch (_) {}

  return { props: { ...session, beneficiaries } }
}

export default BeneficiaryList
