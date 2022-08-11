// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/*
Check gas cost for register including checking standard is supported

public swaps

*/
 
contract NFTSwapper is Context, Ownable
{ 
    using Counters for Counters.Counter;  

    enum SwapState{ Pending, Cancelled, Completed } 
   
    event SwapStateChanged(uint256 indexed id, SwapState indexed state);

    struct Token {
        address NFT;
        bytes32 TokenId;
        uint256 Amount;
    }
    
    struct Swap {
        uint256 Id;
        SwapState State;
        address Bidder;  
        Token[] Offer;  
        address[] Tendered; 
        Token[] Demand; 
    }

    mapping(uint256=>Swap) private _swaps;
    mapping(address=>uint256[]) private _participants;
    ISwapperHandler[] private _handlers; 
    Counters.Counter private _counter;
 
    constructor(address[] memory handlerAddresses) { 
        for (uint256 i = 0; i < handlerAddresses.length; i++) {
            supportStandard(handlerAddresses[i]);
        }
    }
 
    // ############################ MODIFIER METHODS ############################
 
    modifier existsSwapId(uint256 id){
        require(_swaps[id].Id > 0, "NFTSwapper: id does not exist");
        _;
    }
    modifier onlyBidder(uint256 id, address applicant){
        require(_swaps[id].Bidder == applicant, "NFTSwapper: not the bidder");
        _;
    }
    modifier onlyTendered(uint256 id, address applicant) {
        Swap storage s = _swaps[id];
        bool isTendered = false;
        for(uint256 i=0; i<s.Tendered.length; i++){
            if(s.Tendered[i] == address(0) || s.Tendered[i] == applicant){
                isTendered = true;
                break;
            }
        }
        require(isTendered, "NFTSwapper: not a tendered"); 
        _;
    }
    modifier stillPending(uint256 id){
        require(_swaps[id].State == SwapState.Pending, "NFTSwapper: swap is completed or cancelled");
        _;
    }

    // ############################ PUBLIC METHODS ############################

   function register(address bidder, Token[] calldata offer, address[] calldata tendered, Token[] calldata demand)   
                        public returns (uint256 id)
    { 
        require(bidder != address(0), "NFTSwapper: bidder is not valid");
        _counter.increment();
        id = _counter.current(); 
        _swaps[id].Id = id;
        _swaps[id].Bidder = bidder;
        _participants[bidder].push(id);
        for(uint256 i=0; i<offer.length; i++){
            _swaps[id].Offer.push(offer[i]);
        }
        //_swaps[id].Tendered = tendered;
        for(uint256 i=0; i<tendered.length; i++){
            _swaps[id].Tendered.push(tendered[i]);
            _participants[tendered[i]].push(id);
        }
        for(uint256 i=0; i<demand.length; i++){
            _swaps[id].Demand.push(demand[i]);
        }
        emit SwapStateChanged(id, SwapState.Pending);
    }

    function cancel(uint256 id) public
                    existsSwapId(id)
                    onlyBidder(id, _msgSender())
                    stillPending(id)
    { 
        _swaps[id].State = SwapState.Cancelled; 
        emit SwapStateChanged(id, SwapState.Cancelled);
    }
    function uncancel(uint256 id) public
                    existsSwapId(id)
                    onlyBidder(id, _msgSender())
    {  
        require(_swaps[id].State == SwapState.Cancelled, "NFTSwapper: uncancel: swap is not cancelled");
        _swaps[id].State = SwapState.Pending; 
        emit SwapStateChanged(id, SwapState.Pending);
    }

    function swap(uint256 id, address[] memory nfts, bytes32[] memory tokenIds, uint256[] memory amounts) public
                    existsSwapId(id)
                    onlyTendered(id, _msgSender())
                    stillPending(id)
    {
        Swap storage s = _swaps[id]; 
        require(nfts.length == tokenIds.length, "NFTSwapper: swap: nfts and tokenIds must have the same length");
        require(nfts.length == amounts.length, "NFTSwapper: swap: nfts and amounts must have the same length");
        require(nfts.length == s.Demand.length, "NFTSwapper: swap: given NFTs length different from expected NFTs length");

        for(uint256 i=0; i<s.Demand.length; i++){
            Token storage token = s.Demand[i];
            require(token.NFT == nfts[i], "NFTSwapper: swap: given NFT doesn't match demanded NFT");
            require(token.TokenId == tokenIds[i], "NFTSwapper: swap: given tokenId doesn't match demanded tokenId");
            require(token.Amount == amounts[i], "NFTSwapper: swap: given tokenId doesn't match demanded tokenId");
            ISwapperHandler handler = getHandler(token.NFT); 
            require(handler.isOwnerOf(_msgSender(), token.NFT, token.TokenId, token.Amount), "NFTSwapper: swap: sender is not the owner of demanded NFTs");
            require(handler.transferOwnership(_msgSender(), token.NFT, token.TokenId, token.Amount, s.Bidder), "NFTSwapper: swap: transfer from tendered to bidder failed");  
        }

        for(uint256 i=0; i<s.Offer.length; i++){
            Token storage token = s.Offer[i];
            ISwapperHandler handler = getHandler(token.NFT); 
            require(handler.isOwnerOf(s.Bidder, token.NFT, token.TokenId, token.Amount), "NFTSwapper: swap: Swap bidder is not the owner of offered NFTs");
            require(handler.transferOwnership(s.Bidder, token.NFT, token.TokenId, token.Amount, _msgSender()), "NFTSwapper: swap: transfer from bidder to tendered failed");
        }
        s.State = SwapState.Completed;
        emit SwapStateChanged(id, SwapState.Completed);
    }

    function setApprovedTendered(uint256 id, address applicant, bool approved) public
                            existsSwapId(id)
                            onlyBidder(id, _msgSender())
    {
        address[] storage tendered = _swaps[id].Tendered;
        if(approved){
            for(uint256 i=0; i<tendered.length; i++){
                if(tendered[i] == applicant){
                    return;
                }
            }
            tendered.push(applicant);
            _participants[applicant].push(id);
        }else{
            for(uint256 i=0; i<tendered.length; i++){
                if(tendered[i] == applicant){
                    delete tendered[i];
                    tendered.pop();
                    for(uint256 j=0; j<_participants[applicant].length; j++){
                        if(_participants[applicant][j] == id){
                            delete _participants[applicant][j];
                            _participants[applicant].pop();
                            break;
                        } 
                    }
                    return;
                }
            }
        }  
    }

    /**
    * @dev Get a swap. 
    */
    function getSwap(uint256 id) public view existsSwapId(id) returns(Swap memory){
        return _swaps[id];
    }

    function getSwaps(address account) public view returns(uint256[] memory){
        return _participants[account];
    }

    /**
    * @dev Get the amount of swaps. 
    */
    function getSwapCount() public view virtual returns(uint256){
        return _counter.current();
    }

    function getHandler(address nft) public view returns(ISwapperHandler handler)
    {
        for(uint256 i=0; i<_handlers.length; i++){
            if(_handlers[i].isHandlerOf(nft)){
                handler = _handlers[i];
                return handler;
            }
        }
        require(false, "NFTSwapper: getHandler: no handler found");
    }

    // ############################ OWNER METHODS ############################
 
    function supportStandard(address handlerAddress) public onlyOwner()
    {
        require(ISwapperHandler(handlerAddress).supportsInterface(type(ISwapperHandler).interfaceId), "handler does not support ISwapperHandler");
        _handlers.push(ISwapperHandler(handlerAddress));
    }
    function unsupportStandard(address handlerAddress) public onlyOwner()
    {
        require(ISwapperHandler(handlerAddress).supportsInterface(type(ISwapperHandler).interfaceId), "handler does not support ISwapperHandler");
        for(uint256 i = 0; i < _handlers.length; i++) {
            if(_handlers[i] == ISwapperHandler(handlerAddress)) {
                delete _handlers[i];
                break;
            }
        } 
    }
  
}
