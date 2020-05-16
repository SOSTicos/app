import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import { Controller } from 'react-hook-form'

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2.5),
  },
}))

const Input = ({ inputRef, control, className, label, error, errorText, name, ...props }) => {
  const styles = useStyles()

  return (
    <FormGroup className={className}>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>

      <FormControl variant="outlined" className={styles.input} error={error}>
        {control ? (
          <Controller
            error={error}
            as={TextField}
            fullWidth
            name={name}
            variant="outlined"
            control={control}
            {...props}
          />
        ) : (
          <TextField error={error} fullWidth name={name} variant="outlined" {...props} />
        )}
        {error && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </FormGroup>
  )
}

export default Input
