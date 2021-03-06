import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/createEmotionCache'
import Navbar from '../src/Navbar'
import Copyright from '../src/Copyright'
import Box from '@mui/material/Box'

const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  /*
   * Just a state variable we use to store our user's public wallet.
   */

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <Component {...pageProps} />
          <Box sx={{ mt: 6 }} />
          <Box
            component="footer"
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, mb: 1 }}
          >
            <Copyright />
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  )
}
