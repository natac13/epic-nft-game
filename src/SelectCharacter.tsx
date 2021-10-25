import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ethers } from 'ethers'
import * as React from 'react'
import { MyEpicGame } from '../typechain'
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  transformCharacterData,
} from './constants'

export interface SelectCharacterProps {
  setCharacterNFT?: React.Dispatch<React.SetStateAction<unknown>>
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectCharacter: React.FC<SelectCharacterProps> = (props) => {
  const { setCharacterNFT, setLoading } = props
  const [characters, setCharacters] = React.useState([])
  const [gameContract, setGameContract] = React.useState<MyEpicGame | null>(
    null
  )

  const getCharacters = async () => {
    try {
      const tx = await gameContract?.getAllDefaultCharacters()
      const characters = tx?.map((data) => transformCharacterData(data))
      setCharacters(characters)
    } catch (err) {
      console.log({ err })
    }
  }

  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        setLoading?.(true)
        console.log('Minting character in progress...')
        const mintTxn = await gameContract.mintCharacterNFT(characterId)
        await mintTxn.wait()
        console.log('mintTxn:', mintTxn)
      }
      setLoading?.(false)
    } catch (error) {
      console.warn('MintCharacterAction Error:', error)
    }
  }

  const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
    )

    /*
     * Once our character NFT is minted we can fetch the metadata from our contract
     * and set it in state to move onto the Arena
     */
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT()
      console.log('CharacterNFT: ', characterNFT)
      setCharacterNFT(transformCharacterData(characterNFT))
    }
  }

  React.useEffect(() => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const gameContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        )

        setGameContract(gameContract)
      } else {
        console.log('Get Metamask')
      }
    } catch (err) {
      console.log({ err })
    }
  }, [])

  React.useEffect(() => {
    if (gameContract) {
      getCharacters()
      gameContract.on('CharacterNFTMinted', onCharacterMint)
    }
    return () => {
      if (gameContract) {
        gameContract.off('CharacterNFTMinted', onCharacterMint)
      }
    }
  }, [gameContract])

  return (
    <Box>
      <Typography variant="h4" align="center" color="secondary">
        Mint Your Hero. Choose wisely.
      </Typography>

      <Box display="flex" justifyContent="space-evenly" mt={4} gap={2}>
        {characters?.map((char, idx) => (
          <Card sx={{ width: '400px' }}>
            <CardMedia
              component="img"
              src={char.imageURI}
              height="400px"
              sx={{ objectFit: 'contain' }}
            />
            <CardHeader title={char.name} />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Attribute</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Level</TableCell>
                    <TableCell align="right">{char.level}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Strength</TableCell>
                    <TableCell align="right">{char.strength}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dexterity</TableCell>
                    <TableCell align="right">{char.dexterity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Attack Dmg</TableCell>
                    <TableCell align="right">{char.attackDamage}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={mintCharacterNFTAction(idx)}
              >
                Mint
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default SelectCharacter
