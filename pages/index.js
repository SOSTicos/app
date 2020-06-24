import Typography from '@material-ui/core/Typography'
import Layout from '../client/components/layout'
import { getSession } from '../client/lib/auth'

const Home = ({ user }) => {
  return (
    <Layout user={user} my={6}>
      <Typography component="div" align="center" gutterBottom>
        <img style={{ width: 180 }} src="/logo.png" alt="Logo SOS Ticos" />
      </Typography>
      <Typography variant="h5" gutterBottom align="center">
        Inicio
      </Typography>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default Home
