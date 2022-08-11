// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./NFTSwapper.sol"; 
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Swapper is NFTSwapper, IERC721Receiver{
  
    constructor() NFTSwapper() {}

    function isOwnerOf(address nft, uint256 tokenId, address account) 
                        public view override returns (bool){
        return IERC721(nft).ownerOf(tokenId) == account;
    }

    function transferOwnership(address from, address nftAddress, uint256 tokenId, address to)
                                public override returns(bool){
         IERC721(nftAddress).safeTransferFrom(from, to, tokenId);
         return true;
    }
    function transferBatchOwnership(address from, address[] memory nftAddresses, uint256[] memory tokenIds, address to)
                                public override returns(bool){
        require(nftAddresses.length == tokenIds.length, "ERC721Exchange: transferBatchOwnership: different length");
        for(uint256 i=0; i<nftAddresses.length; i++){
            IERC721(nftAddresses[i]).safeTransferFrom(from, to, tokenIds[i]); 
        } 
         return true;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
                                public pure override returns (bytes4) {
        operator; from; tokenId; data;
        return this.onERC721Received.selector;
    }
}


