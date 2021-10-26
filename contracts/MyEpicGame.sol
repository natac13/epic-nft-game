// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import 'hardhat/console.sol';

// We need to import the helper functions from the contract that we copy/pasted.
import {Base64} from './libraries/Base64.sol';

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicGame is ERC721 {
  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
    uint256 level;
    uint256 strength;
    uint256 dexterity;
  }

  struct BigBoss {
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
    uint256 level;
  }

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  CharacterAttributes[] defaultCharacters;

  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  mapping(address => uint256) public nftHolders;

  BigBoss public bigBoss;

  event CharacterNFTMinted(
    address sender,
    uint256 tokenId,
    uint256 characterIndex
  );
  event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDmg,
    uint256[] memory characterStrengths,
    uint256[] memory characterDexterities,
    string memory bigBossName,
    string memory bigBossImageURI,
    uint256 bossHp,
    uint256 bossAttackDamage,
    uint256 bossLevel
  ) ERC721('D2 LoD', 'DLOD') {
    for (uint256 i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(
        CharacterAttributes({
          characterIndex: i,
          name: characterNames[i],
          imageURI: characterImageURIs[i],
          hp: characterHp[i],
          maxHp: characterHp[i],
          attackDamage: characterAttackDmg[i],
          level: 1,
          strength: characterStrengths[i],
          dexterity: characterDexterities[i]
        })
      );

      CharacterAttributes memory c = defaultCharacters[i];
      // console.log(
      //   'Done initializing %s w/ HP %s, img %s, strength %d, dex $d.',
      //   c.name,
      //   c.hp,
      //   c.imageURI,
      //   c.strength.toNumber(),
      //   c.dexterity.toNumber(),
      //   // c.level
      // );
    }

    // set tokenId equal to 1 at the start
    _tokenIds.increment();

    // Initialize the boss. Save it to our global "bigBoss" state variable.
    bigBoss = BigBoss({
      name: bigBossName,
      imageURI: bigBossImageURI,
      hp: bossHp,
      maxHp: bossHp,
      attackDamage: bossAttackDamage,
      level: bossLevel
    });
  }

  function mintCharacterNFT(uint256 _characterIndex) external {
    uint256 newItemId = _tokenIds.current();

    _safeMint(msg.sender, newItemId);

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].hp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage,
      strength: defaultCharacters[_characterIndex].strength,
      dexterity: defaultCharacters[_characterIndex].dexterity,
      level: defaultCharacters[_characterIndex].level
    });

    console.log(
      'Minted NFT w/ tokenId %s and characterIndex %s',
      newItemId,
      _characterIndex
    );

    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = newItemId;

    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();

    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    override
    returns (string memory)
  {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(
      charAttributes.attackDamage
    );
    string memory strength = Strings.toString(charAttributes.strength);
    string memory dexterity = Strings.toString(charAttributes.dexterity);
    string memory level = Strings.toString(charAttributes.level);

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',
            strHp,
            ', "max_value":',
            strMaxHp,
            '}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,
            '}, { "trait_type": "Strength", "value": ',
            strength,
            '}, { "trait_type": "Dexterity", "value": ',
            dexterity,
            '}, { "trait_type": "Level", "value": ',
            level,
            '} ]}'
          )
        )
      )
    );

    string memory output = string(
      abi.encodePacked('data:application/json;base64,', json)
    );

    return output;
  }

  function attackBoss() public {
    // Get the state of the player's NFT.
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[
      nftTokenIdOfPlayer
    ];

    console.log(
      '\nPlayer w/ character %s about to attack. Has %s HP and %s AD',
      player.name,
      player.hp,
      player.attackDamage
    );
    console.log(
      'Boss %s has %s HP and %s AD',
      bigBoss.name,
      bigBoss.hp,
      bigBoss.attackDamage
    );

    // Make sure the player has more than 0 HP.
    require(player.hp > 0, 'Error: character must have HP to attack boss.');

    // Make sure the boss has more than 0 HP.
    require(bigBoss.hp > 0, 'Error: boss must have HP to attack boss.');

    // Allow player to attack boss.
    if (
      bigBoss.hp <
      player.attackDamage + ((player.strength * player.dexterity) % 99)
    ) {
      bigBoss.hp = 0;
    } else {
      bigBoss.hp =
        bigBoss.hp -
        player.attackDamage -
        ((player.strength * player.dexterity) % 99);
    }

    // Allow boss to attack player.
    if (
      player.hp <
      bigBoss.attackDamage - ((player.strength * player.dexterity) % 99)
    ) {
      player.hp = 0;
    } else {
      player.hp =
        player.hp -
        bigBoss.attackDamage +
        ((player.strength * player.dexterity) % 99);
    }

    // Console for ease.
    console.log('Boss attacked player. New player hp: %s\n', player.hp);
    emit AttackComplete(bigBoss.hp, player.hp);
  }

  function checkIfUserHasNFT()
    public
    view
    returns (CharacterAttributes memory)
  {
    uint256 userNftTokenId = nftHolders[msg.sender];

    if (userNftTokenId > 0) {
      return nftHolderAttributes[userNftTokenId];
    } else {
      CharacterAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultCharacters()
    public
    view
    returns (CharacterAttributes[] memory)
  {
    return defaultCharacters;
  }

  function getBigBoss() public view returns (BigBoss memory) {
    return bigBoss;
  }
}
