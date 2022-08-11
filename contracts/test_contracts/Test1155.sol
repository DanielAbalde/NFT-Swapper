// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;
 
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; 

contract Test1155 is ERC1155
{
  uint256 private _tokenCount;

  constructor() ERC1155(""){ }
 
 function mint(address to, uint256 amount) public returns (uint256 tokenId) { 
    tokenId = ++_tokenCount; 
    _mint(to, tokenId, amount, "");
  }
}