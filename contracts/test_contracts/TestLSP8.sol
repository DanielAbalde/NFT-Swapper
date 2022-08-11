// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;
 
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

contract TestLSP8 is LSP8IdentifiableDigitalAsset
{
  uint256 private _tokenCount;

  constructor(address owner) LSP8IdentifiableDigitalAsset("Test", "TEST", owner){ }
 
 function mint(address to) public returns (uint256 tokenId) { 
    tokenId = ++_tokenCount; 
    _mint(to, bytes32(tokenId), true, "");
  }
}