// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFTSwapper
 * Peer to peer swap of multiple NFT.  
 * @author Daniel Gonzalez Abalde aka @DGANFT aka DaniGA#9856.
 * @dev Inherits from this contract for each NFT type. 
 */
abstract contract NFTSwapper is Context
{
    using Counters for Counters.Counter;  

    enum SwapState{ Pending, Deposited, Claimed, Cancelled }
    event SwapStateChanged(uint256 swapId, SwapState state);

    struct Swap{
        uint256 Id;
        SwapState StateA; address OwnerA; address[] NFTContractA; uint256[] tokenIdsA;
        SwapState StateB; address OwnerB; address[] NFTContractB; uint256[] tokenIdsB;
        bool Public;   
    }
 
    mapping(uint256=>Swap) private _swaps;
    mapping(address=>uint256[]) private _members; 
    Counters.Counter private _idCounter; 

    constructor() {}

    // ############################  ABSTRACT METHODS ############################
 
    function ownerOf(address nft, uint256 tokenId) public view virtual returns (address);

    function transferOwnership(address from, address nftAddress, uint256 tokenId, address to) public virtual returns(bool);

    function transferBatchOwnership(address from, address[] memory nftAddresses, uint256[] memory tokenIds, address to) public virtual returns(bool);

    // ############################  MODIFIER METHODS ############################
 
    modifier onlyOwnerOf(address account, address[] memory nftAddresses, uint256[] memory tokenIds){
        require(nftAddresses.length == tokenIds.length, "NFTSwapper: onlyOwnerOf: different length");
        if(account != address(0)){
            for(uint256 i=0; i<nftAddresses.length; i++){
                require(ownerOf(nftAddresses[i], tokenIds[i]) == account, "NFTSwapper: onlyOwnerOf: not the owner");
            }
        }
        _; 
    }
    modifier onlyParticipant(uint256 swapId, address account){
        require(_swaps[swapId].OwnerA == account || _swaps[swapId].OwnerB == account, "NFTSwapper: onlyParticipant");
        _;
    }
    modifier existsSwapId(uint256 swapId){
        require(_swaps[swapId].Id > 0, "NFTSwapper: swapId does not exist");
        _;
    }
    modifier notCancelled(uint256 swapId){
        require(_swaps[swapId].StateA != SwapState.Cancelled, "NFTSwapper: swap is cancelled");
        _;
    }
   
    // ############################  PUBLIC METHODS ############################
 
    /**
    * @dev Register a new swap. This does not transfer any NFT.
    * @param ownerA the address of participant A. 
    * @param nftAddressesA the NFT contracts swapd by participant A.
    * @param tokenIdsA the NFT token id swapd by participant A.
    * @param ownerB the address of participant B. 
    * @param nftAddressesB the NFT contracts swapd by participant B.
    * @param tokenIdsB the NFT token id swapd by participant B.
    * @param public_ if true, the swap data is publicly available and can be obtained from getSwap(uint256) method.
    * @return swapId the swap id. 
    */
    function register(address ownerA, address[] memory nftAddressesA, uint256[] memory tokenIdsA,
                      address ownerB, address[] memory nftAddressesB, uint256[] memory tokenIdsB,
                      bool public_) 
                        onlyOwnerOf(ownerA, nftAddressesA, tokenIdsA) 
                        onlyOwnerOf(ownerB, nftAddressesB, tokenIdsB) 
                        public virtual returns (uint256 swapId)
    { 
        //require(ownerA != ownerB, "NFTSwapper: register: same owner");
        _idCounter.increment();
        swapId = _idCounter.current();
        _swaps[swapId] = Swap(swapId, SwapState.Pending, ownerA, nftAddressesA, tokenIdsA, SwapState.Pending, ownerB, nftAddressesB, tokenIdsB, public_);
        _members[ownerA].push(swapId);
        _members[ownerB].push(swapId);
        emit SwapStateChanged(swapId, SwapState.Pending);
        return swapId;
    }  
    /**
    * @dev If the swap has not yet taken place, it is irrevocably marked as a cancelled swap and the NFTs are returned to their original owners.
    * @param swapId the swap id. 
    */
    function cancel(uint256 swapId)
                    existsSwapId(swapId) 
                    onlyParticipant(swapId, _msgSender()) public virtual {
        Swap memory e = _swaps[swapId]; 
        require(e.StateA != SwapState.Cancelled && e.StateB != SwapState.Cancelled, "NFTSwapper: state is already cancelled");
        e.StateA = SwapState.Cancelled;
        e.StateB = SwapState.Cancelled;
        _swaps[swapId] = e;
        address thisContract = address(this);
        for(uint256 i=0; i<e.NFTContractA.length; i++){
            if(ownerOf(e.NFTContractA[i], e.tokenIdsA[i]) == thisContract){
                transferOwnership(thisContract, e.NFTContractA[i], e.tokenIdsA[i], e.OwnerA);
            }
        }
        for(uint256 i=0; i<e.NFTContractB.length; i++){
            if(ownerOf(e.NFTContractB[i], e.tokenIdsB[i]) == thisContract){
                transferOwnership(thisContract, e.NFTContractB[i], e.tokenIdsB[i], e.OwnerB);
            }
        }
        emit SwapStateChanged(swapId, SwapState.Cancelled);
    }
    /**  
    * @dev Temporarily deposit the NFTs in this contract in a specific swap.
    * @param swapId the swap id. 
    * @param nftAddresses the NFT contracts swapd by participant .
    * @param tokenIds the NFT token id swapd by participant.
    * Note that nftAddresses and tokenIds parameters are redundant since they are already stored on-chain, 
    * but in this way the depositor has certainty that the swap will be carried out with the expected NFTs.
    */
    function deposit(uint256 swapId, address[] memory nftAddresses, uint256[] memory tokenIds)      
                    onlyOwnerOf(_msgSender(), nftAddresses, tokenIds)
                    existsSwapId(swapId)
                    notCancelled(swapId)
                    public virtual returns (bool deposited){
        Swap memory e = _swaps[swapId]; 
        if(e.OwnerA == _msgSender()){
            require(e.StateA == SwapState.Pending, "NFTSwapper: deposit: state is not pending"); 
            require(e.NFTContractA.length == nftAddresses.length, "NFTSwapper: deposit: different length");
            for (uint256 i=0; i<e.NFTContractA.length; i++){
                require(e.NFTContractA[i] == nftAddresses[i], "NFTSwapper: deposit: different NFT contract");
                require(e.tokenIdsA[i] == tokenIds[i], "NFTSwapper: deposit: different token id");
            }
            require(transferBatchOwnership(_msgSender(), e.NFTContractA, e.tokenIdsA, address(this)), "NFTSwapper: deposit: transfer ownership failed");
            e.StateA = SwapState.Deposited;
            _swaps[swapId] = e;
            emit SwapStateChanged(swapId, SwapState.Deposited);
            deposited = true; 
        }else if(e.OwnerB == _msgSender() || e.OwnerB == address(0)){
            require(e.StateB == SwapState.Pending, "NFTSwapper: deposit: state is not pending"); 
            require(e.NFTContractB.length == nftAddresses.length, "NFTSwapper: deposit: different length");
            for (uint256 i=0; i<e.NFTContractB.length; i++){
                require(e.NFTContractB[i] == nftAddresses[i], "NFTSwapper: deposit: different NFT contract");
                require(e.tokenIdsB[i] == tokenIds[i], "NFTSwapper: deposit: different token id");
            }
            require(transferBatchOwnership(_msgSender(), e.NFTContractB, e.tokenIdsB, address(this)), "NFTSwapper: deposit: operation failed");
            e.StateB = SwapState.Deposited;
            if(e.OwnerB == address(0)){
                e.OwnerB = _msgSender();
            }
            _swaps[swapId] = e;
            emit SwapStateChanged(swapId, SwapState.Deposited);
            deposited = true; 
        }
        deposited = false;
    }
    
    /**
    * @dev Claims completion of a swap. 
    * If both participants have deposit their NFTs, the first to claim trigger the swap and the NFTs are sent to their new owners.
    * @param swapId the swap identifier. 
    */
    function claim(uint256 swapId)
                    existsSwapId(swapId)
                    onlyParticipant(swapId, _msgSender())
                    notCancelled(swapId)
                    public virtual
    {
        Swap memory e = _swaps[swapId]; 
        require(e.StateA == SwapState.Deposited, "NFTSwapper: claim: state A is not deposited");
        require(e.StateB == SwapState.Deposited, "NFTSwapper: claim: state B is not deposited");
        require(transferBatchOwnership(address(this), e.NFTContractB, e.tokenIdsB, e.OwnerA), "NFTSwapper: claim: contract to A failed");
        e.StateA = SwapState.Claimed;
        require(transferBatchOwnership(address(this), e.NFTContractA, e.tokenIdsA, e.OwnerB), "NFTSwapper: claim: contract to B failed");
        e.StateB = SwapState.Claimed;
        _swaps[swapId] = e;
        emit SwapStateChanged(swapId, SwapState.Claimed);
    }
    /**
    * @dev Get the state of a swap.
    * @param swapId the swap identifier. 
    */
    function getState(uint256 swapId) existsSwapId(swapId) public view virtual returns (SwapState){  
        Swap memory e = _swaps[swapId];
        if(e.StateA == SwapState.Claimed && e.StateB == SwapState.Claimed){
            return SwapState.Claimed;
        }
        if(e.StateA == SwapState.Pending || e.StateB == SwapState.Pending){
            return SwapState.Pending;
        }
        if(e.StateA == SwapState.Deposited && e.StateB == SwapState.Deposited){
            return SwapState.Deposited;
        }
        if(e.StateA == SwapState.Cancelled || e.StateB == SwapState.Cancelled){
            return SwapState.Cancelled;
        }
        return SwapState.Pending;
    }
    /**
    * @dev Get a swap of the sender account. 
    */
    function getSwap(uint256 swapId) public view virtual returns(Swap memory){ 
        Swap memory e = _swaps[swapId];
        require(e.Public || _msgSender() == e.OwnerA || _msgSender() == e.OwnerB, "NFTSwapper: getSwap: swap is not public");
        return e;
    }
    /**
    * @dev Get the swaps of the sender account. 
    */
    function getSwaps(address account) public view virtual returns(uint256[] memory){
        return _members[account];
    }
    function getSwapCount() public view virtual returns(uint256){
        return _idCounter.current();
    }
}
