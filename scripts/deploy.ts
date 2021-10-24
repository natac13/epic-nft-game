// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat'

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT')
  const nftContract = await nftContractFactory.deploy(100)
  await nftContract.deployed()
  console.log('Contract deployed to:', nftContract.address)

  // Call the function.
  const txn = await nftContract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
  console.log('Minted NFT #1')

  const totalSupply = await nftContract.getTotalNFTsMined()
  console.log(`Total Supply: ${totalSupply?.toNumber()}`)

  // txn = await nftContract.makeAnEpicNFT()
  // // Wait for it to be mined.
  // await txn.wait()
  // console.log('Minted NFT #2')
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
