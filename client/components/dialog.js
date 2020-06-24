import { Fragment, forwardRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Slide from '@material-ui/core/Slide'
import BaseDialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import i18n from '../lib/i18n'

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles({
  avatar: {},
  progress: {
    marginBottom: 8,
  },
})

const Dialog = ({ loading, disableAccept, title, children, onClose, onAccept, open }) => {
  const styles = useStyles()

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      TransitionComponent={Transition}
      aria-labelledby="escaner"
    >
      {loading ? (
        <DialogContent>
          <CircularProgress color="primary" size={48} thickness={4} className={styles.progress} />
        </DialogContent>
      ) : (
        <Fragment>
          <DialogTitle id="escanear-codigo">{title}</DialogTitle>

          <DialogContent>{children}</DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              {i18n`Cancelar`}
            </Button>
            <Button disabled={disableAccept} onClick={onAccept} color="primary" autoFocus>
              {i18n`Aceptar`}
            </Button>
          </DialogActions>
        </Fragment>
      )}
    </BaseDialog>
  )
}

export default Dialog
