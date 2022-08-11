// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol"; 
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/ILSP8IdentifiableDigitalAsset.sol";


contract LSP8Handler is ISwapperHandler {

    function isHandlerOf(address nft) public view override returns (bool){
        return ILSP8IdentifiableDigitalAsset(nft).supportsInterface(type(ILSP8IdentifiableDigitalAsset).interfaceId);
    }

    function isOwnerOf(address account, address nft, bytes32 tokenId, uint256 /*amount*/) 
                        public view override returns (bool){
        return ILSP8IdentifiableDigitalAsset(nft).tokenOwnerOf(tokenId) == account;
    }

    function transferOwnership(address from, address nft, bytes32 tokenId, uint256 /*amount*/, address to)
                                public override returns(bool){
         ILSP8IdentifiableDigitalAsset(nft).transfer(from, to, tokenId, true, "");
         return true;
    }

      function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ISwapperHandler).interfaceId || super.supportsInterface(interfaceId);
    }
}