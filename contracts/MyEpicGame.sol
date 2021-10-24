// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import 'hardhat/console.sol';

// We need to import the helper functions from the contract that we copy/pasted.
import {Base64} from './libraries/Base64.sol';

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicGame {
  constructor() {
    console.log('Epic nft game start');
  }
}
