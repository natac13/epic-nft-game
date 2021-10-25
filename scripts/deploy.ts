// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat'

const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame')
  const gameContract = await gameContractFactory.deploy(
    ['Barbarian', 'Sorceress', 'Paladin'], // Names
    [
      'https://i.imgur.com/NPcuXhA.jpeg',
      'https://i.imgur.com/3n2DCC7.jpeg',
      'https://i.imgur.com/88paaIX.jpeg',
    ],
    [100, 200, 300], // HP values
    [100, 50, 25], // Attack damage values
    [400, 100, 250], // strength values
    [100, 300, 300] // dexterity values,
  )
  await gameContract.deployed()
  console.log('Contract deployed to:', gameContract.address)

  let txn
  txn = await gameContract.mintCharacterNFT(0)
  await txn.wait()
  console.log('Minted NFT #1')

  txn = await gameContract.mintCharacterNFT(1)
  await txn.wait()
  console.log('Minted NFT #2')

  txn = await gameContract.mintCharacterNFT(2)
  await txn.wait()
  console.log('Minted NFT #3')

  txn = await gameContract.mintCharacterNFT(3)
  await txn.wait()
  console.log('Minted NFT #4')

  console.log('Done deploying and minting!')
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()
