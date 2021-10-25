import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Link from './Link'

export interface NavbarProps {
  account?: string
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { account } = props

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h5"
          component="div"
          align="center"
          sx={{ flex: '1 0', display: 'flex', justifyContent: 'flex-start' }}
        >
          Epic NFTs
        </Typography>
        <Box
          sx={{
            flex: '1 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link href="/" underline="none">
            Home
          </Link>
        </Box>
        <Box flex="1 0" display="flex" justifyContent="flex-end">
          {account ?? '0x0...'}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
