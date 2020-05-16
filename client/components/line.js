import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
  },
  label: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },

  text: {
    marginTop: 0,
    fontSize: '1.1rem',
    fontWeight: '500',
    marginBottom: theme.spacing(1),
  },
}))

const Line = ({ value, label }) => {
  const styles = useStyles()

  return (
    <FormGroup style={{ justifyContent: 'space-between' }}>
      <Typography className={styles.label} variant="subtitle1" color="primary">
        {label}
      </Typography>
      <Typography component="div" className={styles.text}>
        {value}
      </Typography>
    </FormGroup>
  )
}

export default Line
