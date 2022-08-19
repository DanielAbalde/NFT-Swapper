// SPDX-License-Identifier: GNU-3
pragma solidity ^0.8.9;

import "./ISwapperHandler.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTSwapper is Context, Ownable
{ 
    using Counters for Counters.Counter;  

    enum SwapState{ Pending, Cancelled, Completed } 
   
    event SwapStateChanged(uint256 indexed id, SwapState indexed state);
    event WithdrawBalance(address indexed sender, uint256 indexed amount);

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

    mapping(address=>uint256) private _contributorShares;
    address[] private _contributors;
    uint256 private _totalShares;
    uint256 private _registerFee = 0 ether;
    uint256 private _swapFee = 0 ether;

    ISwapperHandler[] private _handlers;  
    Counters.Counter private _counter;
    
    constructor(address[] memory handlerAddresses) { 
        for (uint256 i = 0; i < handlerAddresses.length; i++) {
            supportStandard(handlerAddresses[i]);
        }
        setContributor(_msgSender(), 100);
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
        for(uint256 i=0; i<s.Tendered.length; i++){
            if(s.Tendered[i] == address(0) || s.Tendered[i] == applicant){
                _;
                return;
            }
        }
        require(false, "NFTSwapper: not a tendered"); 
        
    }
    modifier onlyParticipant(uint256 id, address applicant) {
        uint256[] memory participants = _participants[applicant];
        for(uint256 i=0; i<participants.length; i++){
            if(participants[i] == id){
                _;
                return;
            }
        }
        require(false, "NFTSwapper: not a participant"); 
    } 
    modifier onlyContributor() {
        require(_contributorShares[_msgSender()] > 0, "NFTSwapper: not a contributor"); 
        _;
    }
    modifier stillPending(uint256 id){
        require(_swaps[id].State == SwapState.Pending, "NFTSwapper: swap is completed or cancelled");
        _;
    }

    // ############################ PUBLIC METHODS ############################

   function register(address bidder, Token[] calldata offer, address[] calldata tendered, Token[] calldata demand)   
                        public payable returns (uint256 id)
    { 
        require(bidder != address(0), "NFTSwapper: register: bidder is not valid");
        require(msg.value >= getRegisterFee(), "NFTSwapper: register: insufficient value for register");
        _counter.increment();
        id = _counter.current(); 
        _swaps[id].Id = id;
        _swaps[id].Bidder = bidder;
        _participants[bidder].push(id);
        for(uint256 i=0; i<offer.length; i++){
            getHandler(offer[i].NFT);
            _swaps[id].Offer.push(offer[i]);
        }
        for(uint256 i=0; i<tendered.length; i++){
            _swaps[id].Tendered.push(tendered[i]);
            _participants[tendered[i]].push(id);
        }
        for(uint256 i=0; i<demand.length; i++){
            getHandler(demand[i].NFT);
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

    function swap(uint256 id) public payable
                    existsSwapId(id)
                    onlyTendered(id, _msgSender())
                    stillPending(id)
    {
        require(msg.value >= getSwapFee(), "NFTSwapper: swap: insufficient value for swap");
        Swap storage s = _swaps[id]; 
        for(uint256 i=0; i<s.Demand.length; i++){
            Token storage token = s.Demand[i];ISwapperHandler handler = getHandler(token.NFT); 
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
                    if(tendered.length == 0){ 
                        tendered.push(address(0));
                        _participants[address(0)].push(id);
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

    function getHandlers() public view returns(ISwapperHandler[] memory){
        return _handlers;
    }

 
    // ############################ OWNER/CONTRIBUTOR METHODS ############################

    function supportStandard(address handlerAddress) public onlyOwner()
    {
        require(ISwapperHandler(handlerAddress).supportsInterface(type(ISwapperHandler).interfaceId), "handler does not support ISwapperHandler");
        _handlers.push(ISwapperHandler(handlerAddress));
    }
    function unsupportStandard(address handlerAddress) public onlyOwner()
    {
        require(ISwapperHandler(handlerAddress).supportsInterface(type(ISwapperHandler).interfaceId), "handler does not support ISwapperHandler");
        for(uint256 i = 0; i < _handlers.length; i++) {
            if(address(_handlers[i]) == handlerAddress) {
                delete _handlers[i];
                _handlers.pop();
                break;
            }
        } 
    }

    function setContributor(address contributor, uint256 share) public onlyOwner()
    { 
        require(contributor.code.length == 0, "NFTSwapper: setContributor: contributor address is not a EOA");
        if(share > 0){
            if(_contributorShares[contributor] > 0){
                _totalShares = _totalShares - _contributorShares[contributor] + share;
                _contributorShares[contributor] = share; 
            }else{
                _totalShares = _totalShares + share;
                _contributorShares[contributor] = share;
                _contributors.push(contributor);
            }
        }else{
            require(_contributorShares[contributor] > 0, "NFTSwapper: removeContributor: contributor not found");
            _totalShares = _totalShares - _contributorShares[contributor];
            for(uint256 i = 0; i < _contributors.length; i++) {
                if(_contributors[i] == contributor) {
                    delete _contributors[i];
                    _contributors.pop();
                    break;
                }
            }
            delete _contributorShares[contributor];
        } 
    }

    function getContributors() public view onlyContributor() returns(address[] memory){
        return _contributors;
    }
    function getTotalShares() public view onlyContributor() returns(uint256){
        return _totalShares;
    }
    function getShare(address constributor) public view onlyContributor() returns(uint256){
        return _contributorShares[constributor];
    }

 
    // ############################ FEES METHODS ############################

    function getRegisterFee() public view returns(uint256){
        return _registerFee;
    }
    function setRegisterFee(uint256 fee) public onlyOwner()
    {
        _registerFee = fee;
    }

    function getSwapFee() public view returns(uint256){
        return _swapFee;
    }
    function setSwapFee(uint256 fee) public onlyOwner()
    {
        _swapFee = fee;
    }

    function withdraw() public onlyContributor(){
        uint256 balance = address(this).balance;
        require(balance > 0, "NFTSwapper: withdraw: no balance"); 
        for(uint256 i=0; i<_contributors.length; i++){
            address payable contributor = payable(_contributors[i]);
            uint256 share = _contributorShares[contributor];
            uint256 amount = balance * share / _totalShares;
            contributor.transfer(amount);
        }
        emit WithdrawBalance(_msgSender(), balance);
    }
    
    receive() external payable {}
    fallback() external payable {}
}
