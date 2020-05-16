import { Fragment, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import BaseAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import ListItemText from '@material-ui/core/ListItemText'
import AppsIcon from '@material-ui/icons/Apps'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import CropFreeIcon from '@material-ui/icons/CropFree'
import DashboardIcon from '@material-ui/icons/Dashboard'
import Divider from '@material-ui/core/Divider'
import Button from './button'
import * as tokens from '../../shared/lib/tokens'
import i18n from '../../shared/lib/i18n'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: -theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: 16,
  },
  button: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
}))

const AppBar = ({ user, title = '', backLabel, onBack }) => {
  const [anchorElement, setAnchorElement] = useState(null)
  const [locale, setLocale] = useState('es')
  const theme = useTheme()
  const router = useRouter()
  const styles = useStyles()
  const open = Boolean(anchorElement)

  const isAuth = Boolean(user)

  const onMenu = (event) => {
    setAnchorElement(event.currentTarget)
  }

  const onClose = () => {
    setAnchorElement(null)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    setLocale(i18n.state.locale || locale)
  }, [])

  const navigate = (to) => {
    router.push(to)
    onClose()
  }

  return (
    <div className={styles.root}>
      <BaseAppBar elevation={1} style={{ backgroundColor: theme.palette.common.white }}>
        <Toolbar>
          {Boolean(onBack) && (
            <Button
              fullWidth={false}
              variant="text"
              color="primary"
              aria-label="back"
              onClick={onBack}
              className={styles.button}
              style={{ marginLeft: -8 }}
              startIcon={<ArrowBackIcon style={{ fontSize: 32 }} />}
            >
              {backLabel || i18n`Volver`}
            </Button>
          )}

          <Fragment>
            {!onBack && (
              <IconButton
                edge="end"
                color="primary"
                aria-label="menu"
                onClick={onMenu}
                className={styles.menuButton}
                style={{ marginLeft: -16 }}
              >
                <AppsIcon style={{ fontSize: 40 }} />
              </IconButton>
            )}
            <Menu
              id="appbar"
              keepMounted
              open={open}
              onClose={onClose}
              anchorEl={anchorElement}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => navigate('/')}>
                <DashboardIcon color="primary" className={styles.icon} />
                <ListItemText primary={i18n`Inicio`} />
              </MenuItem>
              <MenuItem onClick={() => navigate('/scan')}>
                <CropFreeIcon color="primary" className={styles.icon} />
                <ListItemText primary={i18n`Registrar`} />
              </MenuItem>
              <Divider />
              {isAuth && (
                <MenuItem
                  onClick={() => {
                    tokens.del()
                    setTimeout(() => {
                      window.location = '/'
                    }, 1000)
                  }}
                >
                  <ExitToAppIcon color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Salir`} />
                </MenuItem>
              )}
            </Menu>
          </Fragment>

          <Typography variant="h5" className={styles.title}>
            {title}
          </Typography>

          <IconButton
            edge="end"
            color="primary"
            aria-label="profile"
            onClick={() => navigate('/profile')}
            className={styles.menuButton}
          >
            <AccountCircleIcon style={{ fontSize: 40 }} />
          </IconButton>
        </Toolbar>
      </BaseAppBar>
    </div>
  )
}

AppBar.defaultProps = {}

export default AppBar
