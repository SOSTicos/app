import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2.5),
  },
}))

const CheckboxInput = ({
  inputRef,
  control,
  className,
  label,
  error,
  errorText,
  name,
  ...props
}) => {
  const styles = useStyles()

  return (
    <FormGroup className={className}>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>

      <FormControl variant="outlined" className={styles.input} error={error}>
        <Checkbox {...props} />
      </FormControl>
    </FormGroup>
  )
}

export default CheckboxInput
