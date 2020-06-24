import TextField from '@material-ui/core/TextField'
import BaseAutocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import { Controller } from 'react-hook-form'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2.5),
  },
}))

const Autocomplete = ({ className, name, label, error, errorText, ...props }) => {
  const styles = useStyles()

  return (
    <FormGroup className={className}>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>
      <FormControl fullWidth variant="outlined" className={styles.input} error={error}>
        <Controller
          as={BaseAutocomplete}
          name={name}
          onChange={([_, value]) => value}
          getOptionLabel={(option) => option.name}
          getOptionSelected={(option, value) => option._id === value._id}
          popupIcon={<KeyboardArrowDownIcon style={{ color: '#222' }} />}
          renderInput={(parameters) => (
            <TextField
              required
              className={styles.root}
              {...parameters}
              inputProps={{
                ...parameters.inputProps,
              }}
              variant="outlined"
              error={error}
            />
          )}
          {...props}
        />
        {error && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </FormGroup>
  )
}

export default Autocomplete
