import {
  Box,
  CircularProgress,
  Container,
  Grow,
  Link,
  Typography,
} from '@mui/material'
import Button from '@mui/material/Button'
import * as React from 'react'
import { ethers } from 'ethers'

const CONTRACT_ADDRESS = ''

const createOpenSeaLink = (
  contractAddress: string,
  tokenId: string
): string => {
  return `https://testnets.opensea.io/assets/${contractAddress}/${tokenId}`
}

const createRaribleLink = (
  contractAddress: string,
  tokenId: string
): string => {
  return `https://rinkeby.rarible.com/token/${contractAddress}/${tokenId}`
}

export default function Index() {
  const [currentAccount, setCurrentAccount] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const checkCorrectBlockchain = async () => {
    const { ethereum } = window
    if (ethereum) {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log('Connected to chain ' + chainId)

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = '0x4'
      if (chainId !== rinkebyChainId) {
        alert('You are not connected to the Rinkeby Test Network!')
      }
    }
    return true
  }
  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        // const connectedContract = new ethers.Contract(
        //   CONTRACT_ADDRESS,
        //   myEpicNft.abi,
        //   signer
        // )

        console.log('Setup event listener!')
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
        setupEventListener()
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])

      // setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    checkCorrectBlockchain()?.then(checkIfWalletIsConnected)
  }, [])

  return (
    <Container maxWidth="md">
      <Box
        component="header"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexFlow: 'column',
          my: 2,
        }}
      >
        <Typography variant="h1" align="center" fontWeight="700">
          Epic Nft Game
        </Typography>
        {currentAccount && (
          <Box mt={3} display="flex" alignItems="center">
            <Typography variant="h6" sx={{ mr: 1 }}>
              Connected Account:
            </Typography>
            <Typography variant="subtitle1">{currentAccount}</Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          my: 3,
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          flexFlow: 'column',
          gap: 2,
        }}
      >
        {/* <Grow in={!!currentAccount}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Button variant="contained" color="primary" onClick={getMinedCount}>
              Get Mined NFT Count
            </Button>
            <Button
              variant="outlined"
              color="primary"
              target="_blank"
              href="https://testnets.opensea.io/collection/squarenft-xmductv7w7"
            >
              View Collection
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={askContractToMintNft}
            >
              Mint NFT
            </Button>
          </Box>
        </Grow> */}
        <Grow in={!currentAccount}>
          <Button
            color="primary"
            variant="outlined"
            onClick={connectWallet}
            disabled={loading}
          >
            Connect Wallet
          </Button>
        </Grow>
      </Box>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" align="center">
            Pending Transaction
          </Typography>
          <CircularProgress color="secondary" size={50} />
        </Box>
      )}
    </Container>
  )
}
