// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol"; 
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20Handler is ISwapperHandler {
 
    function isHandlerOf(address tokenContract) public view override returns (bool){
      bool success;
      bytes memory data;
      (success, data) = tokenContract.staticcall(abi.encodeWithSignature("supportsInterface(uint256)", type(IERC20).interfaceId));
      if(success) {
        return abi.decode(data, (bool));
      }else{
        (success, data) = tokenContract.staticcall(abi.encodeWithSignature("totalSupply()"));
        if(!success) {
          return false;
        }
        (success, data) = tokenContract.staticcall(abi.encodeWithSignature("balanceOf(address)", msg.sender));
        if(!success) {
          return false;
        }
        return true;
      } 
    }

    function isOwnerOf(address account, address tokenContract, bytes32 /*tokenId*/, uint256 amount) 
                        public view override returns (bool){
        return IERC20(tokenContract).balanceOf(account) >= amount;
    } 
    function transferOwnership(address from, address tokenContract, bytes32 /*tokenId*/, uint256 amount, address to)
                                public override returns(bool){ 
        IERC20(tokenContract).transferFrom(from, to, amount); 
        return true;
    }
 
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ISwapperHandler).interfaceId || super.supportsInterface(interfaceId);
    }
}
