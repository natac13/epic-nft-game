import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { ethers } from 'ethers'
import * as React from 'react'
import { MyEpicGame } from '../typechain'
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  transformCharacterData,
} from './constants'

export interface ArenaProps {
  characterNFT: unknown
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const Arena: React.FC<ArenaProps> = (props) => {
  const { characterNFT, setLoading, setCharacterNFT } = props
  const [gameContract, setGameContract] = React.useState<MyEpicGame | null>(
    null
  )
  const [boss, setBoss] = React.useState(null)

  const [attackState, setAttackState] = React.useState<
    'attacking' | 'hit' | ''
  >('')

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState('attacking')
        console.log('Attacking boss...')
        const attackTxn = await gameContract.attackBoss()
        setLoading(true)
        await attackTxn.wait()
        setLoading(false)
        console.log('attackTxn:', attackTxn)
        setAttackState('hit')
      }
    } catch (error) {
      console.error('Error attacking boss:', error)
      setAttackState('')
    }
  }

  const onAttackComplete = (newBossHp, newPlayerHp) => {
    const bossHp = newBossHp.toNumber()
    const playerHp = newPlayerHp.toNumber()

    console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`)

    /*
     * Update both player and boss Hp
     */
    setBoss((prevState) => {
      return { ...prevState, hp: bossHp }
    })

    setCharacterNFT((prevState) => {
      return { ...prevState, hp: playerHp }
    })
  }

  const fetchBoss = async (gameContract: MyEpicGame) => {
    const tx = await gameContract.getBigBoss()
    setBoss(transformCharacterData(tx))
  }

  React.useEffect(() => {
    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      ) as MyEpicGame

      setGameContract(gameContract)
    } else {
      console.log('Get metamask')
    }
  }, [])

  React.useEffect(() => {
    if (gameContract) {
      fetchBoss(gameContract)
      gameContract?.on('AttackComplete', onAttackComplete)
    }

    return () => {
      gameContract?.off('AttackComplete', onAttackComplete)
    }
  }, [gameContract])

  return (
    <Box>
      <Typography variant="h4">Boss Arena</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          {boss && (
            <Box width="100%" display="flex" justifyContent="center">
              <Card sx={{ maxWidth: 600 }}>
                <CardMedia
                  component="img"
                  src={boss.imageURI}
                  sx={{ maxHeight: 400, objectFit: 'contain' }}
                />
                <CardHeader title={boss.name} />
                <CardContent>
                  <Typography variant="subtitle2">Health</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(boss.hp / boss.maxHp) * 100}
                    sx={{ height: 12 }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{ width: '100%', display: 'inline-block' }}
                  >{`${boss.hp} / ${boss.maxHp}`}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={runAttackAction}
                  >
                    Attack Boss
                  </Button>
                </CardActions>
              </Card>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {!!characterNFT && (
            <Card sx={{ width: '400px' }}>
              <CardMedia
                component="img"
                src={characterNFT.imageURI}
                height="400px"
                sx={{ objectFit: 'contain' }}
              />
              <CardHeader title={characterNFT.name} />
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
                      <TableCell align="right">{characterNFT.level}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Strength</TableCell>
                      <TableCell align="right">
                        {characterNFT.strength}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dexterity</TableCell>
                      <TableCell align="right">
                        {characterNFT.dexterity}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Attack Dmg</TableCell>
                      <TableCell align="right">
                        {characterNFT.attackDamage}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Box>
                  <Typography variant="subtitle2">Health</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(characterNFT.hp / characterNFT.maxHp) * 100}
                    color="secondary"
                    sx={{ height: 12 }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    sx={{ width: '100%', display: 'inline-block' }}
                  >{`${characterNFT.hp} / ${characterNFT.maxHp}`}</Typography>
                </Box>
              </CardContent>
              <CardActions>
                {/* <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={mintCharacterNFTAction(idx)}
                    >
                      Mint
                    </Button> */}
              </CardActions>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Arena
