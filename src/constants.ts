// import { abi } from '../artifacts/contracts/MyEpicGame.sol/MyEpicGame.json'
import { abi } from './utils/ABI.json'

export const transformCharacterData = (characterData) => {
  return {
    name: characterData?.name,
    imageURI: characterData?.imageURI,
    hp: characterData?.hp?.toNumber(),
    maxHp: characterData?.maxHp?.toNumber(),
    attackDamage: characterData?.attackDamage?.toNumber(),
    strength: characterData?.strength?.toNumber(),
    dexterity: characterData?.dexterity?.toNumber(),
    level: characterData?.level?.toNumber(),
  }
}

export const CONTRACT_ADDRESS = '0x68aD853d4836caDE582B4382bA776dF76838ffd1'
export const CONTRACT_ABI = abi
