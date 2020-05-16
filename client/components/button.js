import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import BaseButton from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  wrapper: {
    position: 'relative',
  },
  loader: {
    color: '#AAA',
    position: 'absolute',
    top: 25,
    right: 18,
  },
}))

const Button = ({ disabled, loading = false, loadingText, children, className, ...props }) => {
  const styles = useStyles()

  return (
    <div className={styles.wrapper}>
      <BaseButton
        fullWidth
        size="large"
        color="primary"
        disableElevation
        variant="contained"
        className={clsx(styles.button, className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading && loadingText ? loadingText : children}
      </BaseButton>
      {loading ? <CircularProgress size={30} thickness={5} className={styles.loader} /> : null}
    </div>
  )
}

export default Button
