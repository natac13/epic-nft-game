import { Container } from '@mui/material'
import * as React from 'react'
import Navbar from './Navbar'

export interface LayoutProps {
  account?: string
}

const Layout: React.FC<LayoutProps> = (props) => {
  const { account, children } = props

  return (
    <>
      <Navbar account={account} />
      <Container maxWidth="lg">{children}</Container>
    </>
  )
}

export default Layout
