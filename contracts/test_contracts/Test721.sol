// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;
 
import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 

contract Test721 is ERC721
{
  uint256 private _tokenCount;

  constructor() ERC721("Test", "TEST"){ }
 
  function mint(address to) public returns (uint256 tokenId) { 
    tokenId = ++_tokenCount; 
    _safeMint(to, tokenId, "");
  }
}