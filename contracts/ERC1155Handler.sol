// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol"; 
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract ERC1155Handler is ISwapperHandler, IERC1155Receiver{
   
   
    function isHandlerOf(address nft) public view override returns (bool){
        return IERC1155(nft).supportsInterface(type(IERC1155).interfaceId);
    }

    function isOwnerOf(address account, address nft, bytes32 tokenId, uint256 amount) 
                        public view override returns (bool){
        return IERC1155(nft).balanceOf(account, uint256(tokenId)) >= amount;
    }
 
    function transferOwnership(address from, address nft, bytes32 tokenId, uint256 amount, address to)
                                public override returns(bool){ 
         IERC1155(nft).safeTransferFrom(from, to, uint256(tokenId), amount, ""); 
        return true;
    }

    function onERC1155Received(address, address, uint256, uint256,  bytes memory)
                                public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory)
                                    public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override(ISwapperHandler, IERC165) returns (bool){
        return interfaceId == this.onERC1155Received.selector || interfaceId == this.onERC1155BatchReceived.selector || 
        interfaceId == type(ISwapperHandler).interfaceId || super.supportsInterface(interfaceId); 
    } 
}