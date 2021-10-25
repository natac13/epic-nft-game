import { abi } from '../artifacts/contracts/MyEpicGame.sol/MyEpicGame.json'

export const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    strength: characterData.strength.toNumber(),
    dexterity: characterData.dexterity.toNumber(),
    level: characterData.level.toNumber(),
  }
}

export const CONTRACT_ADDRESS = '0x68C60EF1E5D9ffDE13EfD87Fd677Ba9284B2781F'
export const CONTRACT_ABI = abi
