import { Fragment, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { lighten, makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useRouter } from 'next/router'
import Layout from '../../client/components/layout'
import { getSession, getHeaders } from '../../client/lib/auth'
import { getHost } from '../../client/lib/utils'
import { provincias, cantones, distritos } from '../../shared/lib/locations'
import { estados } from '../../shared/lib/statuses'
import * as api from '../../client/lib/api'

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

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  const isAdmin = ['superadmin', 'admin'].includes(user.role)

  const data = beneficiaries

  const renderItem = (item) => {
    const location =
      (item?.provinceText || '') +
      ', ' +
      (item?.cantonText || '') +
      ', ' +
      (item?.districtText || '')

    return (
      <Paper key={item._id} style={{ marginBottom: 16 }}>
        <ListItem button onClick={() => router.push(`/deliveries/${item._id}`)}>
          <ListItemText
            primaryTypographyProps={{ component: 'div' }}
            primary={
              <Box display="flex" justifyContent="space-between">
                <Typography gutterBottom>{item.name}</Typography>
              </Box>
            }
            secondaryTypographyProps={{ component: 'div' }}
            secondary={
              <Fragment>
                <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                  <Box display="flex" flexDirection="column" justifyContent="space-between">
                    <Typography>{item.necesities}</Typography>
                    <Typography>{location.trim()}</Typography>
                    <Typography>{item.phone}</Typography>
                  </Box>
                </Box>
              </Fragment>
            }
          />
        </ListItem>
      </Paper>
    )
  }

  return (
    <Layout user={user} my={0} mx={1}>
      <Typography variant="h1" gutterBottom>
        {isAdmin ? 'Todas las Entregas' : 'Mis Entregas'}
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginTop={3}
        marginBottom={3}
      ></Box>
      <List className={styles.root}>{data.map((item) => renderItem(item))}</List>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const headers = getHeaders(ctx)
  const host = getHost(ctx)

  let beneficiaries = []

  let deliveryQuery = {
    carrier: session.user._id,
    deliveryStatus: '1',
  }

  if (session.user && ['superadmin', 'admin'].includes(session.user.role)) {
    deliveryQuery = {
      deliveryStatus: '1',
    }
  }

  try {
    if (session.user) {
      beneficiaries = await api.get(`${host}/api/beneficiaries`, deliveryQuery, { headers })
      if (session.user.role === 'coordinator') {
        const centerBeneficiaries = await api.get(
          `${host}/api/beneficiaries`,
          { deliveryStatus: '1', centerId: session.user.centerId },
          { headers }
        )
        beneficiaries = beneficiaries.concat(centerBeneficiaries)
        beneficiaries = beneficiaries.reduce((uniques, item) => {
          const exist = uniques.filter((v) => v._id === item._id)
          if (exist.length === 0) {
            uniques.push(item)
          }

          return uniques
        }, [])
      }
    }

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
