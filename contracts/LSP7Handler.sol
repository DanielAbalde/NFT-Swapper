// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol"; 
import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/ILSP7DigitalAsset.sol";


contract LSP7Handler is ISwapperHandler {

    function isHandlerOf(address nft) public view override returns (bool){
        return ILSP7DigitalAsset(nft).supportsInterface(type(ILSP7DigitalAsset).interfaceId);
    }

    function isOwnerOf(address account, address nft, bytes32 /*tokenId*/, uint256 amount) 
                        public view override returns (bool){
        return ILSP7DigitalAsset(nft).balanceOf(account) >= amount;
    }

    function transferOwnership(address from, address nft, bytes32 /*tokenId*/, uint256 amount, address to)
                                public override returns(bool){
         ILSP7DigitalAsset(nft).transfer(from, to, amount, true, "");
         return true;
    }

     function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ISwapperHandler).interfaceId || super.supportsInterface(interfaceId);
    }
}