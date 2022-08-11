// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol"; 
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Handler is ISwapperHandler, IERC721Receiver{
  
    function isHandlerOf(address nft) public view override returns (bool){
        return IERC721(nft).supportsInterface(type(IERC721).interfaceId);
    }
    
    function isOwnerOf(address account, address nft, bytes32 tokenId, uint256 /*amount*/) 
                        public view override returns (bool){
        return IERC721(nft).ownerOf(uint256(tokenId)) == account;
    } 

    function transferOwnership(address from, address nft, bytes32 tokenId, uint256 /*amount*/, address to)
                                public override returns(bool){ 
        IERC721(nft).safeTransferFrom(from, to, uint256(tokenId)); 
        return true;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
                                public pure override returns (bytes4) {
        operator; from; tokenId; data;
        return this.onERC721Received.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ISwapperHandler).interfaceId || interfaceId == this.onERC721Received.selector || super.supportsInterface(interfaceId);
    }
}
