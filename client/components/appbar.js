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
import PeopleAlt from '@material-ui/icons/PeopleAlt'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Typography from '@material-ui/core/Typography'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import CropFreeIcon from '@material-ui/icons/CropFree'
import DashboardIcon from '@material-ui/icons/Dashboard'
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle'
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

  let canManageCenters = false
  if (isAuth) {
    canManageCenters = ['superadmin', 'admin'].includes(user.role)
  }

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
              <MenuItem onClick={() => navigate('/signin')}>
                <CropFreeIcon color="primary" className={styles.icon} />
                <ListItemText primary={i18n`Registrar`} />
              </MenuItem>
              <Divider />
              {isAuth && canManageCenters && (
                <MenuItem key="deliveries_01" onClick={() => navigate('/deliveries')}>
                  <PeopleAlt color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Mis Entregas`} />
                </MenuItem>
              )}
              <Divider />
              {isAuth && canManageCenters && (
                <MenuItem key="centers_01" onClick={() => navigate('/centers')}>
                  <LocationOnIcon color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Centros`} />
                </MenuItem>
              )}
              {isAuth && [
                <MenuItem key="merchandise_01" onClick={() => navigate('/merchandise')}>
                  <ShoppingCartIcon color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Listado de donativos`} />
                </MenuItem>,
                <MenuItem key="merchandise_02" onClick={() => navigate('/merchandise/reception')}>
                  <ShoppingCartIcon color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Recepción de donativo`} />
                </MenuItem>,
              ]}
              <Divider />
              {isAuth && [
                <MenuItem key="beneficiaries_01" onClick={() => navigate('/beneficiaries')}>
                  <SupervisedUserCircle color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Beneficiarios`} />
                </MenuItem>,
                <MenuItem key="volunteers_01" onClick={() => navigate('/volunteers')}>
                  <PeopleAlt color="primary" className={styles.icon} />
                  <ListItemText primary={i18n`Voluntarios`} />
                </MenuItem>,
              ]}
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

          {isAuth && (
            <IconButton
              edge="end"
              color="primary"
              aria-label="profile"
              onClick={() => navigate('/profile')}
              className={styles.menuButton}
            >
              <AccountCircleIcon style={{ fontSize: 40 }} />
            </IconButton>
          )}
        </Toolbar>
      </BaseAppBar>
    </div>
  )
}

AppBar.defaultProps = {}

export default AppBar
