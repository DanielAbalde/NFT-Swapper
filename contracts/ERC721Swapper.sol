// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "./NFTSwapper.sol"; 
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ERC721Swapper is NFTSwapper, IERC721Receiver{
  
    constructor() NFTSwapper() {}

    function ownerOf(address nft, uint256 tokenId) 
                        public view override returns (address){
        return IERC721(nft).ownerOf(tokenId);
    }

    function transferOwnership(address from, address nftAddress, uint256 tokenId, address to)
                                public override returns(bool){
         IERC721(nftAddress).safeTransferFrom(from, to, tokenId);
         return true;
    }
    function transferBatchOwnership(address from, address[] memory nftAddresses, uint256[] memory tokenIds, address to)
                                public override returns(bool){
        console.log("_msgSender=", _msgSender(), " from=", from);
        console.log("owner=", IERC721(nftAddresses[0]).ownerOf(tokenIds[0]));
        require(nftAddresses.length == tokenIds.length, "ERC721Exchange: transferBatchOwnership: different length");
        for(uint256 i=0; i<nftAddresses.length; i++){
            IERC721(nftAddresses[i]).safeTransferFrom(from, to, tokenIds[i]);
            //(bool success, ) = nftAddresses[i].delegatecall(abi.encodeWithSignature("safeTransferFrom(address,address,uint256,bytes)", from, to, tokenIds[i],""));
            //require(success, "ERC721Exchange: transferBatchOwnership: delegatecall failed");
        } 
         return true;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
                                public pure override returns (bytes4) {
        operator; from; tokenId; data;
        return this.onERC721Received.selector;
    }
}


