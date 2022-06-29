// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./NFTExchange.sol"; 
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Exchange is NFTExchange, IERC721Receiver{
  
    constructor() NFTExchange() {}

    function ownerOf(address nft, uint256 tokenId) 
                        public view override returns (address){
        return IERC721(nft).ownerOf(tokenId);
    }

    function transferOwnership(address owner, address nftAddress, uint256 tokenId, address recipient)
                                public override returns(bool){
         IERC721(nftAddress).safeTransferFrom(owner, recipient, tokenId);
         return true;
    }
    function transferBatchOwnership(address owner, address[] memory nftAddresses, uint256[] memory tokenIds, address recipient)
                                public override returns(bool){
        require(nftAddresses.length == tokenIds.length, "NFTExchange: transferOwnership: different length");
        for(uint256 i=0; i<nftAddresses.length; i++){
            IERC721(nftAddresses[i]).safeTransferFrom(owner, recipient, tokenIds[i]);
        } 
         return true;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
                                public pure override returns (bytes4) {
        operator; from; tokenId; data;
        return this.onERC721Received.selector;
    }
}


