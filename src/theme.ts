import { red, lightBlue, lime } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: lime[500],
    },
    secondary: {
      main: lightBlue[800],
    },
    error: {
      main: red.A400,
    },
  },
})

export default theme
