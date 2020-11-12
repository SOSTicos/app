import Typography from '@material-ui/core/Typography'
import Layout from '../client/components/layout'
import { getSession } from '../client/lib/auth'
import Button from '../client/components/button'
import { useRouter } from 'next/router'

const Home = ({ user }) => {
  // function to redirect user to the signin.
  const router = useRouter()
  const redirect = () => {
    router.replace('/signin')
  }

  // condition to check if the user is logged in and or not.
  let componentForRegister
  if (user === undefined || user === null) {
    componentForRegister = (
      <Button style={{ marginBottom: 0 }} type="submit" onClick={redirect}>{`Registrarse`}</Button>
    )
  } else {
    componentForRegister = <p></p>
  }

  // Component con errores visuales.
  return (
    <Layout user={user} my={6}>
      <Typography component="div" align="center" gutterBottom>
        <img style={{ width: 180 }} src="/logo.png" alt="Logo SOS Ticos" />
      </Typography>
      <Typography variant="h5" gutterBottom align="center">
        Inicio
      </Typography>
      {componentForRegister}
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return { props: { ...session } }
}

export default Home
