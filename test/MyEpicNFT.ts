import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('MyEpicNFT', function () {
  it('Should set total supply', async function () {
    const Contract = await ethers.getContractFactory('MyEpicNFT')
    const contract = await Contract.deploy(10_000)
    await contract.deployed()
    // Call the function.
    const txn = await contract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()

    const totalSupply = await contract.totalSupply()
    expect(totalSupply?.toNumber()).to.equal(10_000)
  })

  it('Should return current number of tokens', async function () {
    const Contract = await ethers.getContractFactory('MyEpicNFT')
    const contract = await Contract.deploy(10_000)
    await contract.deployed()
    // Call the function.
    const txn = await contract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()
    const txn2 = await contract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn2.wait()

    const currentSupply = await contract.getTotalNFTsMined()
    expect(currentSupply?.toNumber()).to.equal(2)
  })

  it('Should respect the total supply', async function () {
    const Contract = await ethers.getContractFactory('MyEpicNFT')
    const contract = await Contract.deploy(1)
    await contract.deployed()
    // Call the function.
    let txn = await contract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()

    try {
      txn = await contract.makeAnEpicNFT()
      // Wait for it to be mined.
      await txn.wait()
      expect(2).to.equal(3)
    } catch (error) {
      // @ts-ignore
      expect(error?.message).to.include('Max Supply of tokens reached')
    }
    // Mint another NFT for fun.
  })
})
