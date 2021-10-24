import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Link from './Link'

export interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props) => {
  const {} = props

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" component="div" align="center">Epic NFTs</Typography>
        <Box
          sx={{
            flex: '1 0',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Link href="/" underline="none">
            Home
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
