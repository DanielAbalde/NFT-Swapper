// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;
 
import "@openzeppelin/contracts/utils/introspection/IERC165.sol"; 

abstract contract ISwapperHandler is IERC165
{
    function isHandlerOf(address nft) public view virtual returns (bool);

    function isOwnerOf(address account, address nft, bytes32 tokenId, uint256 amount) public view virtual returns (bool);

    function transferOwnership(address from, address nft, bytes32 tokenId, uint256 amount, address to) public virtual returns (bool);

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ISwapperHandler).interfaceId || interfaceId == type(IERC165).interfaceId;
    }
}
