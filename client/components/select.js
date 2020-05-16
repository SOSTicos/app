import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import FormGroup from '@material-ui/core/FormGroup'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import BaseSelect from '@material-ui/core/Select'
import { Controller } from 'react-hook-form'

const useStyles = makeStyles((theme) => ({
  input: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2.5),
  },
}))

const Select = ({
  control,
  style,
  className,
  label,
  name,
  error,
  errorText,
  children,
  ...props
}) => {
  const styles = useStyles()
  return (
    <FormGroup className={className} style={style}>
      <InputLabel error={error} htmlFor={name}>
        {label}
      </InputLabel>
      <FormControl variant="outlined" className={styles.input} error={error}>
        {control ? (
          <Controller
            native
            name={name}
            as={BaseSelect}
            IconComponent={KeyboardArrowDownIcon}
            inputProps={{ name, id: name }}
            error={Boolean(error)}
            control={control}
            {...props}
          >
            {children}
          </Controller>
        ) : (
          <BaseSelect
            native
            name={name}
            IconComponent={KeyboardArrowDownIcon}
            inputProps={{ name, id: name }}
            error={Boolean(error)}
            control={control}
            {...props}
          >
            {children}
          </BaseSelect>
        )}
        {error && <FormHelperText>{errorText}</FormHelperText>}
      </FormControl>
    </FormGroup>
  )
}

export default Select
