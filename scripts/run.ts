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
    [100, 300, 300], // dexterity values,
    'Diablow',
    'https://i.imgur.com/llhkXn8.jpeg',
    3000,
    50,
    5
  )
  await gameContract.deployed()
  console.log('Contract deployed to:', gameContract.address)

  let txn
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array.
  txn = await gameContract.mintCharacterNFT(2)
  await txn.wait()

  // Get the value of the NFT's URI.
  const returnedTokenUri = await gameContract.tokenURI(1)
  console.log('Token URI:', returnedTokenUri)

  txn = await gameContract.attackBoss()
  await txn.wait()

  txn = await gameContract.attackBoss()
  await txn.wait()

  txn = await gameContract.attackBoss()
  await txn.wait()
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
