// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;
 
import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/LSP7DigitalAsset.sol";

contract TestLSP7 is LSP7DigitalAsset
{ 
  constructor(address owner) LSP7DigitalAsset("Test", "TEST", owner, true){ }
 
 function mint(address to, uint256 amount) public {  
    _mint(to, amount, true, "");
  }
}