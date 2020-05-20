import { Fragment, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { useTheme, makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Layout from '../client/components/layout'
import { getSession } from '../client/lib/auth'

const useStyles = makeStyles((theme) => ({}))

const Dashboard = ({ user }) => {
  const theme = useTheme()
  const router = useRouter()
  const styles = useStyles()

  useEffect(() => {
    if (!user) router.replace('/signin')
  }, [user])

  return (
    <Layout user={user} my={2}>
      <Typography variant="h1" gutterBottom align="center">
        Dashboard
      </Typography>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default Dashboard
