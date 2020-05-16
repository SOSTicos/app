import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import { debounce } from '../lib/utils'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    borderRadius: 8,
    marginRight: theme.spacing(2),
  },
  input: {
    flex: 1,
    marginRight: 2,
  },
  iconButton: {
    padding: 8,
  },
}))

const Search = ({ onSearch }) => {
  const classes = useStyles()
  const debounceOnSearch = debounce(onSearch, 500)

  return (
    <Paper className={classes.root}>
      <IconButton type="submit" className={classes.iconButton} aria-label="Buscar">
        <SearchIcon />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Buscar"
        inputProps={{ 'aria-label': 'Buscar' }}
        onChange={(event) => debounceOnSearch(event.target.value)}
      />
    </Paper>
  )
}

export default Search
