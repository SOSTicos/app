import { createMuiTheme } from '@material-ui/core/styles'
import { red, grey, pink, deepPurple } from '@material-ui/core/colors'

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: '900',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: '600',
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: '900',
      marginTop: '1rem',
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: '600',

      lineHeight: '40px',
      // marginTop: '1rem',
      // marginBottom: '1.6rem',
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: '600',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: '500',
    },
    button: {
      textTransform: 'none',
      fontWeight: '500',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: '400',
    },
    overline: {
      fontSize: '0.8rem',
      fontWeight: '600',
      lineHeight: '17px',
    },
  },
  palette: {
    primary: {
      main: '#1B89C6',
    },
    secondary: {
      main: pink[700],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  overrides: {
    MuiTextField: {
      root: {
        // border: '1px solid red'
      },
    },
    MuiButton: {
      containedSizeLarge: {
        // paddingTop: 10,
        // paddingBottom: 10,
        // fontSize: '1.2rem',
      },
      sizeSmall: {
        // fontSize: '1.1rem',
      },
      label: {
        fontSize: '1.2rem',
      },
      root: {
        borderRadius: 8,
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: '14px 10px',
      },
      root: {
        borderRadius: 4,
      },
      notchedOutline: {
        borderWidth: 1,
        borderRadius: 4,
        // borderColor: grey[800],
      },
    },
    MuiSelect: {
      icon: {
        color: grey[900],
      },
    },
    MuiInputBase: {
      input: {
        // fontSize: '1.2rem',
        backgroundColor: '#FFF',
      },
    },
    MuiInputLabel: {
      root: {
        color: grey[900],
        fontWeight: '500',
        // fontSize: '1.2rem',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
    },
    MuiTypography: {
      gutterBottom: {
        // marginBottom: '2rem'
      },
    },
    MuiSnackbarContent: {
      root: {
        fontSize: '1.2rem !important',
      },
    },
    MuiAutocomplete: {
      inputRoot: {
        paddingTop: '4px !important',
        paddingBottom: '4px !important',
      },
    },
  },
})

export default theme
