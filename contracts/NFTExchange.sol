// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFTExchange
 * Trustless and self-soveraign exchange of multiple NFT between two partipants.  
 * @author Daniel Gonzalez Abalde aka @DGANFT aka DaniGA#9856.
 * @dev Inherits from this contract for each NFT type. 
 */
abstract contract NFTExchange is Context
{
    using Counters for Counters.Counter;  

    enum ExchangeState{ Pending, Deposited, Claimed, Cancelled }
    event ExchangeStateChanged(uint256 exchangeId, ExchangeState state);

    struct Exchange{
        uint256 Id;
        ExchangeState StateA; address OwnerA; address[] NFTContractA; uint256[] tokenIdsA;
        ExchangeState StateB; address OwnerB; address[] NFTContractB; uint256[] tokenIdsB;      
    }
 
    mapping(uint256=>Exchange) private _exchanges;
    mapping(address=>uint256[]) private _members; 
    Counters.Counter private _idCounter; 

    constructor() {}
 
    function ownerOf(address nft, uint256 tokenId) public view virtual returns (address);

    function transferOwnership(address from, address nftAddress, uint256 tokenId, address to) public virtual returns(bool);

    function transferBatchOwnership(address from, address[] memory nftAddresses, uint256[] memory tokenIds, address to) public virtual returns(bool);


    modifier onlyOwnerOf(address account, address[] memory nftAddresses, uint256[] memory tokenIds){
        require(nftAddresses.length == tokenIds.length, "NFTExchange: onlyOwnerOf: different length");
        for(uint256 i=0; i<nftAddresses.length; i++){
            require(ownerOf(nftAddresses[i], tokenIds[i]) == account, "NFTExchange: onlyOwnerOf: not the owner");
        }
        _;
    }
    modifier onlyParticipant(uint256 exchangeId, address account){
        require(_exchanges[exchangeId].OwnerA == account || _exchanges[exchangeId].OwnerB == account, "NFTExchange: onlyParticipant");
        _;
    }
    modifier existsExchangeId(uint256 exchangeId){
        require(_exchanges[exchangeId].Id > 0, "NFTExchange: existsExchangeId");
        _;
    }
   
    /**
    * @dev Register a new exchange. This does not transfer any NFT.
    * @param ownerA the address of participant A. 
    * @param nftAddressesA the NFT contracts exchanged by participant A.
    * @param tokenIdsA the NFT token id exchanged by participant A.
    * @param ownerB the address of participant B. 
    * @param nftAddressesB the NFT contracts exchanged by participant B.
    * @param tokenIdsB the NFT token id exchanged by participant B.
    * @return exchangeId the exchange id. 
    */
    function register(address ownerA, address[] memory nftAddressesA, uint256[] memory tokenIdsA,
                      address ownerB, address[] memory nftAddressesB, uint256[] memory tokenIdsB) 
                        onlyOwnerOf(ownerA, nftAddressesA, tokenIdsA) 
                        onlyOwnerOf(ownerB, nftAddressesB, tokenIdsB) 
                        public returns (uint256 exchangeId)
    { 
      require(ownerA != ownerB, "NFTExchange: register: same owner");
        _idCounter.increment();
        exchangeId = _idCounter.current();
        _exchanges[exchangeId] = Exchange(exchangeId, ExchangeState.Pending, ownerA, nftAddressesA, tokenIdsA, ExchangeState.Pending, ownerB, nftAddressesB, tokenIdsB);
        _members[ownerA].push(exchangeId);
        _members[ownerB].push(exchangeId);
        emit ExchangeStateChanged(exchangeId, ExchangeState.Pending);
        return exchangeId;
    }  
    /**
    * @dev If the exchange has not yet taken place, it is irrevocably marked as a cancelled exchange and the NFTs are returned to their original owners.
    * @param exchangeId the exchange id. 
    */
    function cancel(uint256 exchangeId)
                    existsExchangeId(exchangeId) 
                    onlyParticipant(exchangeId, _msgSender()) public {
        Exchange memory e = _exchanges[exchangeId]; 
        require(e.StateA != ExchangeState.Cancelled && e.StateB != ExchangeState.Cancelled, "NFTExchange: state is already cancelled");
        e.StateA = ExchangeState.Cancelled;
        e.StateB = ExchangeState.Cancelled;
        _exchanges[exchangeId] = e;
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
        emit ExchangeStateChanged(exchangeId, ExchangeState.Cancelled);
    }
    /**  
    * @dev Temporarily deposit the NFTs in this contract in a specific exchange.
    * @param exchangeId the exchange id. 
    * @param nftAddresses the NFT contracts exchanged by participant .
    * @param tokenIds the NFT token id exchanged by participant.
    * Note that nftAddresses and tokenIds parameters are redundant since they are already stored on-chain, 
    * but in this way the depositor has certainty that the exchange will be carried out with the expected NFTs.
    */
    function deposit(uint256 exchangeId, address[] memory nftAddresses, uint256[] memory tokenIds)      
                    onlyOwnerOf(_msgSender(), nftAddresses, tokenIds)
                    existsExchangeId(exchangeId)
                    public returns (bool deposited){
        Exchange memory e = _exchanges[exchangeId]; 
        if(e.OwnerA == _msgSender()){
            if(e.StateA == ExchangeState.Pending){ 
                require(e.NFTContractA.length == nftAddresses.length, "NFTExchange: deposit: different length");
                for (uint256 i=0; i<nftAddresses.length; i++){
                    require(e.NFTContractA[i] == nftAddresses[i], "NFTExchange: deposit: different NFT contract");
                    require(e.tokenIdsA[i] == tokenIds[i], "NFTExchange: deposit: different token id");
                }
                require(transferBatchOwnership(e.OwnerA, e.NFTContractA, e.tokenIdsA, address(this)), "NFTExchange: deposit: transfer ownership failed");
                e.StateA = ExchangeState.Deposited;
                _exchanges[exchangeId] = e;
                emit ExchangeStateChanged(exchangeId, ExchangeState.Deposited);
                deposited = true;
            }
        }else if(e.OwnerB == _msgSender()){
            if(e.StateB == ExchangeState.Pending){ 
                require(e.NFTContractB.length == nftAddresses.length, "NFTExchange: deposit: different length");
                for (uint256 i=0; i<nftAddresses.length; i++){
                    require(e.NFTContractB[i] == nftAddresses[i], "NFTExchange: deposit: different NFT contract");
                    require(e.tokenIdsB[i] == tokenIds[i], "NFTExchange: deposit: different token id");
                }
                require(transferBatchOwnership(e.OwnerB, e.NFTContractB, e.tokenIdsB, address(this)), "NFTExchange: deposit: operation failed");
                e.StateB = ExchangeState.Deposited;
                _exchanges[exchangeId] = e;
                emit ExchangeStateChanged(exchangeId, ExchangeState.Deposited);
                deposited = true;
            }
        }
        deposited = false;
    }
    
    /**
    * @dev Claims completion of an exchange. 
    * If both participants have deposit their NFTs, the first to claim trigger the exchange and the NFTs are sent to their new owners.
    * @param exchangeId the exchange identifier. 
    */
    function claim(uint256 exchangeId)
                    existsExchangeId(exchangeId) public returns (bool)
    {
        Exchange memory e = _exchanges[exchangeId]; 
        require(e.StateA == ExchangeState.Deposited, "NFTExchange: claim: state A is not supplied");
        require(e.StateB == ExchangeState.Deposited, "NFTExchange: claim: state B is not supplied");
        if(e.StateA == ExchangeState.Deposited && e.StateB == ExchangeState.Deposited){ 
            require(transferBatchOwnership(address(this), e.NFTContractB, e.tokenIdsB, e.OwnerA), "NFTExchange: claim: contract to A failed");
            e.StateA = ExchangeState.Claimed;
            require(transferBatchOwnership(address(this), e.NFTContractA, e.tokenIdsA, e.OwnerB), "NFTExchange: claim: contract to B failed");
            e.StateB = ExchangeState.Claimed;
            _exchanges[exchangeId] = e;
            emit ExchangeStateChanged(exchangeId, ExchangeState.Claimed);
            return true; 
        }else{
            return false;
        }
    }
    /**
    * @dev Get the state of an exchange.
    * @param exchangeId the exchange identifier. 
    */
    function getState(uint256 exchangeId) existsExchangeId(exchangeId) public view returns (ExchangeState){  
        Exchange memory e = _exchanges[exchangeId];
        if(e.StateA == ExchangeState.Claimed || e.StateB == ExchangeState.Claimed){
            return ExchangeState.Claimed;
        }
        if(e.StateA == ExchangeState.Pending || e.StateB == ExchangeState.Pending){
            return ExchangeState.Pending;
        }
        if(e.StateA == ExchangeState.Deposited && e.StateB == ExchangeState.Deposited){
            return ExchangeState.Deposited;
        }
        if(e.StateA == ExchangeState.Cancelled || e.StateB == ExchangeState.Cancelled){
            return ExchangeState.Cancelled;
        }
        return ExchangeState.Pending;
    }
    /**
    * @dev Get the exchanges of the sender account. 
    */
    function getExchanges() public view returns(uint256[] memory){
        return _members[_msgSender()];
    }
    /**
    * @dev Get a exchange of the sender account. 
    */
    function getExchange(uint256 exchangeId)
          onlyParticipant(exchangeId, _msgSender())
          public view returns(Exchange memory){ 
        return _exchanges[exchangeId];
    }
}
