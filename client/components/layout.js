import { Fragment } from 'react'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import AppBard from './appbar'
import Loader from './loader'

const Layout = ({
  transparentBar,
  user,
  loading,
  title,
  backLabel,
  noAppbar,
  onBack,
  children,
  ...props
}) => {
  return (
    <Fragment>
      {!noAppbar && !loading && (
        <AppBard
          user={user}
          title={title}
          loading={loading}
          backLabel={backLabel}
          onBack={onBack}
          transparent={transparentBar}
        />
      )}
      <Container maxWidth="sm" style={{ paddingTop: noAppbar ? 20 : 90 }}>
        <Box my={2} mx={0} {...props}>
          {loading ? <Loader /> : children}
        </Box>
      </Container>
    </Fragment>
  )
}

Layout.defaultProps = {
  noAppbar: false,
}

export default Layout
