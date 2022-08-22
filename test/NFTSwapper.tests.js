const { expect } = require("chai");
const { ethers } = require("hardhat");

let erc721Contract, erc1155Contract, lsp7Contract, lsp8Contract, swapperContract;
let signer, ownerA, ownerB, ownerC;
let erc721Handler, erc1155Handler, lsp7Handler, lsp8Handler, erc20Handler;
let handlers = [];
const zeroAddress = '0x0000000000000000000000000000000000000000';

describe("Initialize", function(){
  before("Get accounts", async function () {
    [signer, ownerA, ownerB, ownerC] = await ethers.getSigners();  
    console.log("signer: " + signer.address, ", balance: ", await getBalance(signer));
    console.log("ownerA: " + ownerA.address, ", balance: ", await getBalance(ownerA),);
    console.log("ownerB: " + ownerB.address, ", balance: ", await getBalance(ownerB));
    console.log("ownerC: " + ownerC.address, ", balance: ", await getBalance(ownerC));
  })

  it("Mint ERC721", async function() {

    const nftFactory = await ethers.getContractFactory("Test721");
    erc721Contract = await nftFactory.deploy();
    await erc721Contract.deployed();

    for(let i = 1; i <= 10; i++) { 
      const responseA = await erc721Contract.mint(ownerA.address);
      const receiptA = await responseA.wait();
      const [transferEventA] = receiptA.events; 
      expect(transferEventA.args.tokenId.toNumber()).to.equal(i);
    }
    for(let i = 11; i <= 20; i++) { 
      const responseB = await erc721Contract.mint(ownerB.address);
      const receiptB = await responseB.wait();
      const [transferEventB] = receiptB.events; 
      expect(transferEventB.args.tokenId.toNumber()).to.equal(i);
    }
  });
  
  it("Mint ERC1155", async function() {

    const nftFactory = await ethers.getContractFactory("Test1155");
    erc1155Contract = await nftFactory.deploy();
    await erc1155Contract.deployed();

    for(let i = 1; i <= 10; i++) { 
      const responseA = await erc1155Contract.mint(ownerA.address, 10);
      const receiptA = await responseA.wait();
      const [transferEventA] = receiptA.events;  
      expect(transferEventA.args.id.toNumber()).to.equal(i);
    }
    for(let i = 11; i <= 20; i++) { 
      const responseB = await erc1155Contract.mint(ownerB.address, 10);
      const receiptB = await responseB.wait();
      const [transferEventB] = receiptB.events; 
      expect(transferEventB.args.id.toNumber()).to.equal(i);
    }
  });
  
  it("Mint LSP7", async function() {

    const nftFactory = await ethers.getContractFactory("TestLSP7");
    lsp7Contract = await nftFactory.deploy(signer.address);
    await lsp7Contract.deployed();

    const responseA = await lsp7Contract.mint(ownerA.address, 100);
    const receiptA = await responseA.wait();
    const balanceA = await lsp7Contract.balanceOf(ownerA.address);
    expect(balanceA.toNumber()).to.equal(100); 

    /*
    const responseB = await lsp7Contract.mint(ownerB.address, 100);
    const receiptB = await responseB.wait();
    const balanceB = await lsp7Contract.balanceOf(ownerB.address);
    expect(balanceB.toNumber()).to.equal(100);
    */
  });
 
  it("Mint LSP8", async function() {

    const nftFactory = await ethers.getContractFactory("TestLSP8");
    lsp8Contract = await nftFactory.deploy(signer.address);
    await lsp8Contract.deployed();

    for(let i = 1; i <= 10; i++) { 
      const responseA = await lsp8Contract.mint(ownerA.address);
      const receiptA = await responseA.wait();
      const [transferEventA] = receiptA.events;   
      expect(parseInt(transferEventA.args.tokenId)).to.equal(i); 
    }
    /*
    for(let i = 11; i <= 20; i++) { 
      const responseB = await lsp8Contract.mint(ownerB.address);
      const receiptB = await responseB.wait();
      const [transferEventB] = receiptB.events; 
      expect(parseInt(transferEventB.args.tokenId)).to.equal(i);
    }
    */
  });
   
  it("Deploy handlers", async function(){
    const erc721HandlerFactory = await ethers.getContractFactory("ERC721Handler");
    const erc1155HandlerFactory = await ethers.getContractFactory("ERC1155Handler");
    const lsp7HandlerFactory = await ethers.getContractFactory("LSP7Handler");
    const lsp8HandlerFactory = await ethers.getContractFactory("LSP8Handler");
    const erc20HandlerFactory = await ethers.getContractFactory("ERC20Handler");

    erc721Handler = await erc721HandlerFactory.deploy();
    erc1155Handler = await erc1155HandlerFactory.deploy();
    lsp7Handler = await lsp7HandlerFactory.deploy();
    lsp8Handler = await lsp8HandlerFactory.deploy();
    erc20Handler = await erc20HandlerFactory.deploy();
    handlers = [erc721Handler.address, erc1155Handler.address, lsp7Handler.address, lsp8Handler.address];

  });

  it("Deploy Swapper", async function() {
 
    const swapperFactory = await ethers.getContractFactory("NFTSwapper");
    swapperContract = await swapperFactory.deploy();
    await swapperContract.deployed();

    for(let i = 0; i < handlers.length; i++) { 
      const txSupportStandards = await swapperContract.supportStandard(handlers[i]);
      await txSupportStandards.wait();
    }
  });

  it("Get dedicated handler", async function() {
      
    const rcErc721Handler = await swapperContract.getHandler(erc721Contract.address); 
    expect(rcErc721Handler).to.equal(erc721Handler.address);
    const rcErc1155Handler = await swapperContract.getHandler(erc1155Contract.address);
    expect(rcErc1155Handler).to.equal(erc1155Handler.address);
    const rcLsp7Handler = await swapperContract.getHandler(lsp7Contract.address);
    expect(rcLsp7Handler).to.equal(lsp7Handler.address);
    const rcLsp8Handler = await swapperContract.getHandler(lsp8Contract.address);
    expect(rcLsp8Handler).to.equal(lsp8Handler.address);
  });

  it("Approve handlers as operator", async function() {

    const txApproveA721 = await erc721Contract.connect(ownerA).setApprovalForAll(erc721Handler.address, true);
    const rcApproveA721 = await txApproveA721.wait();
    const [evApproveA721] = rcApproveA721.events;  
    expect(evApproveA721.args.approved).to.equal(true);

    const txApproveB721 = await erc721Contract.connect(ownerB).setApprovalForAll(erc721Handler.address, true);
    const rcApproveB721 = await txApproveB721.wait();
    const [evApproveB721] = rcApproveB721.events;  
    expect(evApproveB721.args.approved).to.equal(true);
 
    const txApproveA1155 = await erc1155Contract.connect(ownerA).setApprovalForAll(erc1155Handler.address, true);
    const rcApproveA1155 = await txApproveA1155.wait();
    const [evApproveA1155] = rcApproveA1155.events;  
    expect(evApproveA1155.args.approved).to.equal(true);

    const txApproveB1155 = await erc1155Contract.connect(ownerB).setApprovalForAll(erc1155Handler.address, true);
    const rcApproveB1155 = await txApproveB1155.wait();
    const [evApproveB1155] = rcApproveB1155.events;  
    expect(evApproveB1155.args.approved).to.equal(true);

    const txApproveLSP7 = await lsp7Contract.connect(ownerA).authorizeOperator(lsp7Handler.address, 999999999);
    const rcApproveLSP7 = await txApproveLSP7.wait();
    const [evApproveLSP7] = rcApproveLSP7.events;
    expect(evApproveLSP7.args.operator).to.equal(lsp7Handler.address);

    const lsp8tokensIdOfA = await lsp8Contract.tokenIdsOf(ownerA.address);
    for(let i = 0; i < lsp8tokensIdOfA.length; i++) {
      const txApproveLSP8 = await lsp8Contract.connect(ownerA).authorizeOperator(lsp8Handler.address, lsp8tokensIdOfA[i]);
      const rcApproveLSP8 = await txApproveLSP8.wait();
      const [evApproveLSP8] = rcApproveLSP8.events;
      expect(evApproveLSP8.args.operator).to.equal(lsp8Handler.address);
    }
  });

});
 
describe("NFTSwapper", function(){

  it("Register a new swap and get its swap data", async function () {
    
    const addA = [erc721Contract.address, erc1155Contract.address];
    const idA = [1, 1];
    const amoA = [1, 2]; 
    const addB = [erc721Contract.address, erc721Contract.address];
    const idB = [11, 12];
    const amoB = [1, 1]; 
 
    const ownerOfA0 = await erc721Contract.ownerOf(idA[0]);
    expect(ownerOfA0 === ownerA.address).to.equal(true);
    const ownerOfA1 = (await erc1155Contract.balanceOf(ownerA.address, idA[1])).toNumber();
    expect(ownerOfA1 >= amoA[1]).to.equal(true);
    const ownerOfB0 = await erc721Contract.ownerOf(idB[0]);
    expect(ownerOfB0 === ownerB.address).to.equal(true);
    const ownerOfB1 = await erc721Contract.ownerOf(idB[1]);
    expect(ownerOfB1 === ownerB.address).to.equal(true);

    const isApprovedA0 = await erc721Contract.isApprovedForAll(ownerA.address, erc721Handler.address);
    expect(isApprovedA0).to.equal(true);
    const isApprovedA1 = await erc1155Contract.isApprovedForAll(ownerA.address, erc1155Handler.address);
    expect(isApprovedA1).to.equal(true);
    const isApprovedB0 = await erc721Contract.isApprovedForAll(ownerB.address, erc721Handler.address);
    expect(isApprovedB0).to.equal(true);
    const isApprovedB1 = await erc721Contract.isApprovedForAll(ownerB.address, erc721Handler.address);
    expect(isApprovedB1).to.equal(true);
 
    const swapId = await registerSwap(ownerA.address, addA, idA, amoA, [ownerB.address], addB, idB, amoB);
    expect(swapId).to.equal(1);

    const txGetSwap = await swapperContract.connect(ownerA.address).getSwap(swapId);
    
    expect(txGetSwap.Bidder).to.equal(ownerA.address);
    expect(txGetSwap.Offer[0].NFT).to.equal(addA[0]);
    expect(txGetSwap.Offer[1].NFT).to.equal(addA[1]);
    expect(bytes32ToInt(txGetSwap.Offer[0].TokenId)).to.equal(idA[0]);
    expect(bytes32ToInt(txGetSwap.Offer[1].TokenId)).to.equal(idA[1]);
    expect(txGetSwap.Tendered[0]).to.equal(ownerB.address); 
    expect(txGetSwap.Demand[0].NFT).to.equal(addB[0]);
    expect(txGetSwap.Demand[1].NFT).to.equal(addB[1]);
    expect(bytes32ToInt(txGetSwap.Demand[0].TokenId)).to.equal(idB[0]);
    expect(bytes32ToInt(txGetSwap.Demand[1].TokenId)).to.equal(idB[1]);
  });
  
  it("Cancel a swap", async function () {

    const swapId = 1;

    try{
      const txCancelC = await swapperContract.connect(ownerC).cancel(swapId);
      console.log("Cancel a swap by non-owner should fail");
      expect(false).to.equal(true); 
    }catch(e){ 
      //console.log(e);
    }
    
    const txCancel = await swapperContract.connect(ownerA).cancel(swapId);
    const reCancel = await txCancel.wait();

    const txGetSwap = await swapperContract.connect(ownerA).getSwap(swapId);
    expect(txGetSwap.State).to.equal(1);
  });

  it("Uncancel a swap", async function () {

    const swapId = 1;
 
    const txCancel = await swapperContract.connect(ownerA).uncancel(swapId);
    const reCancel = await txCancel.wait();

    const txGetSwap = await swapperContract.connect(ownerA).getSwap(swapId);
    expect(txGetSwap.State).to.equal(0);
  });
 
  it("Add a tendered", async function(){
    const swapId = 1;
    const txSetApprovedTendered = await swapperContract.connect(ownerA).setApprovedTendered(swapId, ownerC.address, true);
    const rcSetApprovedTendered = await txSetApprovedTendered.wait();

    const txGetSwap = await swapperContract.connect(ownerA).getSwap(swapId); 
    expect(txGetSwap.Tendered[0]).to.equal(ownerB.address);
    expect(txGetSwap.Tendered[1]).to.equal(ownerC.address);
  });
 
  it("Remove a tendered", async function(){
    const swapId = 1;
    const txSetApprovedTendered = await swapperContract.connect(ownerA).setApprovedTendered(swapId, ownerC.address, false);
    const rcSetApprovedTendered = await txSetApprovedTendered.wait();

    const txGetSwap = await swapperContract.connect(ownerA).getSwap(swapId); 
    expect(txGetSwap.Tendered[0]).to.equal(ownerB.address);
    expect(txGetSwap.Tendered.length).to.equal(1);
  });
   
  it("Should not duplicate a tendered", async function(){
    const swapId = 1;
    const txSetApprovedTendered = await swapperContract.connect(ownerA).setApprovedTendered(swapId, ownerB.address, true);
    const rcSetApprovedTendered = await txSetApprovedTendered.wait();

    const txGetSwap = await swapperContract.connect(ownerA).getSwap(swapId);
    expect(txGetSwap.Tendered.length).to.equal(1);
  });
  
  it("Register a long swap", async function(){
    const count = 200;
    const addA = [];
    const idA = [];
    const amoA = [];
    const addB = [];
    const idB = [];
    const amoB = [];
    for(let i = 0; i < count; i++){
      addA.push(erc721Contract.address);
      idA.push(1);
      amoA.push(1);
      addB.push(erc721Contract.address);
      idB.push(1);
      amoB.push(1);
    }
    const swapId = await registerSwap(ownerA.address, addA, idA, amoA, [ownerB.address], addB, idB, amoB);
    const txGetSwap = await swapperContract.connect(ownerA.address).getSwap(swapId);
    expect(txGetSwap.Offer.length).to.equal(count);
  });

  it("Register an open swap", async function(){
    const addA = [erc721Contract.address, erc1155Contract.address];
    const idA = [1, 1];
    const amoA = [1, 2];
    const addB = [erc721Contract.address, erc721Contract.address];
    const idB = [intToBytes32(11), intToBytes32(12)];
    const amoB = [1, 1];
    const swapId = await registerSwap(ownerA.address, addA, idA, amoA, [zeroAddress], addB, idB, amoB);

  });

  it("Get account swaps", async function(){
    var txGetSwaps = await swapperContract.getSwaps(ownerA.address);
    expect(txGetSwaps.length).to.equal(3);
    expect(txGetSwaps[0].toNumber()).to.equal(1);
    expect(txGetSwaps[1].toNumber()).to.equal(2);
    expect(txGetSwaps[2].toNumber()).to.equal(3);

    txGetSwaps = await swapperContract.getSwaps(ownerB.address);
    expect(txGetSwaps.length).to.equal(2);
    expect(txGetSwaps[0].toNumber()).to.equal(1);
    expect(txGetSwaps[1].toNumber()).to.equal(2);

    txGetSwaps = await swapperContract.getSwaps(ownerC.address);
    expect(txGetSwaps.length).to.equal(0);

    txGetSwaps = await swapperContract.getSwaps(zeroAddress);
    expect(txGetSwaps.length).to.equal(1);

  });

  it("Register swap and remove all tendered", async function(){
    const addA = [erc721Contract.address, erc1155Contract.address];
    const idA = [1, 1];
    const amoA = [1, 2];
    const addB = [erc721Contract.address, erc721Contract.address];
    const idB = [intToBytes32(11), intToBytes32(12)];
    const amoB = [1, 1];
    const swapId = await registerSwap(ownerA.address, addA, idA, amoA, [ownerB.address], addB, idB, amoB);

    const txSetApprovedTendered = await swapperContract.connect(ownerA).setApprovedTendered(swapId, ownerB.address, false);
    const rcSetApprovedTendered = await txSetApprovedTendered.wait();

    var txGetSwaps = await swapperContract.getSwaps(ownerB.address);
    expect(txGetSwaps.length).to.equal(2); 

    txGetSwaps = await swapperContract.getSwaps(zeroAddress);
    expect(txGetSwaps.length).to.equal(2);
  });

  it("Register swap and make it public and then closed", async function(){
    const addA = [erc721Contract.address, erc1155Contract.address];
    const idA = [1, 1];
    const amoA = [1, 2];
    const addB = [erc721Contract.address, erc721Contract.address];
    const idB = [intToBytes32(11), intToBytes32(12)];
    const amoB = [1, 1];
    const swapId = await registerSwap(ownerA.address, addA, idA, amoA, [ownerB.address], addB, idB, amoB);

    var txSetApprovedTendered = await swapperContract.connect(ownerA).setApprovedTendered(swapId, zeroAddress, true);
    var rcSetApprovedTendered = await txSetApprovedTendered.wait();

    var txGetSwaps = await swapperContract.getSwaps(ownerB.address);
    expect(txGetSwaps.length).to.equal(3); 

    txGetSwaps = await swapperContract.getSwaps(zeroAddress);
    expect(txGetSwaps.length).to.equal(3);

    txSetApprovedTendered = await swapperContract.connect(ownerA).setApprovedTendered(swapId, zeroAddress, false);
    rcSetApprovedTendered = await txSetApprovedTendered.wait();

    var txGetSwaps = await swapperContract.getSwaps(ownerB.address);
    expect(txGetSwaps.length).to.equal(3); 

    txGetSwaps = await swapperContract.getSwaps(zeroAddress);
    expect(txGetSwaps.length).to.equal(2);
  });
 
  it("Perform a swap", async function () {
       
    const addA = [erc721Contract.address, erc1155Contract.address, lsp7Contract.address, lsp8Contract.address];
    const idA = [intToBytes32(1), intToBytes32(1), intToBytes32(1), intToBytes32(1)];
    const amoA = [1, 2, 10, 1]; 
    const addB = [erc721Contract.address, erc721Contract.address];
    const idB = [intToBytes32(11), intToBytes32(12)];
    const amoB = [1, 1]; 

    const swapId = await registerSwap(ownerA.address, addA, idA, amoA, [ownerB.address], addB, idB, amoB);
   
    try{
      const txSwapA = await swapperContract.connect(ownerA).swap(swapId);
      const reSwapA = await txSwapA.wait();
      console.log("Swap a swap by bidder should fail");
      expect(false).to.equal(true); 
    }catch(e){ 
      //console.log(e);
    }

    try{
      const txSwapC = await swapperContract.connect(ownerC).swap(swapId);
      const reSwapC = await txSwapC.wait();
      console.log("Swap a swap by ownerC should fail");
      expect(false).to.equal(true); 
    }catch(e){ 
      //console.log(e);
    }

    const txSwap = await swapperContract.connect(ownerB).swap(swapId);
    const reSwap = await txSwap.wait(); 
    const evSwap = reSwap.events[reSwap.events.length-1];
    expect(evSwap.args.id.toNumber()).to.equal(swapId);
    expect(evSwap.args.state).to.equal(2); 
   
    const txGetSwap = await swapperContract.connect(ownerA).getSwap(swapId);
    expect(txGetSwap.State).to.equal(2);
    //console.log(txGetSwap);

    const ownerOfA0 = await erc721Contract.ownerOf(idA[0]);
    expect(ownerOfA0 === ownerB.address).to.equal(true);
    const ownerOfA1 = (await erc1155Contract.balanceOf(ownerB.address, idA[1])).toNumber();
    expect(ownerOfA1 >= amoA[1]).to.equal(true);
    const ownerOfA2 = (await lsp7Contract.balanceOf(ownerB.address)).toNumber();
    expect(ownerOfA2 >= amoA[2]).to.equal(true);
    const ownerOfA3 = (await lsp8Contract.tokenOwnerOf(intToBytes32(idA[3])));
    expect(ownerOfA3 === ownerB.address).to.equal(true);
    
    const ownerOfB0 = await erc721Contract.ownerOf(idB[0]);
    expect(ownerOfB0 === ownerA.address).to.equal(true);
    const ownerOfB1 = await erc721Contract.ownerOf(idB[1]);
    expect(ownerOfB1 === ownerA.address).to.equal(true);
  });

  it("Support new standard", async function(){

    var handlerCount = (await swapperContract.getHandlers()).length;
    expect(handlerCount).to.equal(4);

    const txSupportStandard = await swapperContract.supportStandard(erc20Handler.address);
    const rcSupportStandard = await txSupportStandard.wait();

    handlerCount = (await swapperContract.getHandlers()).length;
    expect(handlerCount).to.equal(5);

  });
  
  it("Unsupport standard", async function(){
 
    const txSupportStandard = await swapperContract.unsupportStandard(erc20Handler.address);
    const rcSupportStandard = await txSupportStandard.wait();

    handlerCount = (await swapperContract.getHandlers()).length;
    expect(handlerCount).to.equal(4);

  });

  it("Add and remove contributor", async function(){
    const initShare = 100;
    var totalShares = await swapperContract.getTotalShares();
    expect(totalShares.toNumber()).to.equal(initShare);

    const txSetContributor0 = await swapperContract.setContributor(ownerB.address, 30);
    const rcSetContributor0 = await txSetContributor0.wait();

    var contributors = await swapperContract.getContributors();
    expect(contributors.length).to.equal(2);

    totalShares = await swapperContract.getTotalShares();
    expect(totalShares.toNumber()).to.equal(initShare + 30);

    const txSetContributor1 = await swapperContract.setContributor(ownerB.address, 0);
    const rcSetContributor1 = await txSetContributor1.wait();

    contributors = await swapperContract.getContributors();
    expect(contributors.length).to.equal(1);
 
    totalShares = await swapperContract.getTotalShares();
    expect(totalShares.toNumber()).to.equal(initShare); 
  });

  it("Change share of contributor", async function(){
 
    const share = 70;
    const txSetContributor = await swapperContract.setContributor(signer.address, share);
    const rcSetContributor = await txSetContributor.wait();

    var contributors = await swapperContract.getContributors();
    expect(contributors.length).to.equal(1);

    var totalShares = await swapperContract.getTotalShares();
    expect(totalShares.toNumber()).to.equal(share);

  });

  it("Only contributor", async function(){

    try{ 
      var totalShares = await swapperContract.connect(ownerA).getTotalShares(); 
      console.log("getTotalShares by ownerA should fail");
      expect(false).to.equal(true); 
    }catch(e){ 
      //console.log(e);
    }

    const share = 30;
    const txSetContributor = await swapperContract.setContributor(ownerA.address, share);
    const rcSetContributor = await txSetContributor.wait();

    var shareA = await swapperContract.connect(ownerA).getShare(ownerA.address); 
    expect(shareA.toNumber()).to.equal(share);
  });

  it("Change fees", async function(){
 
    var newFee = ethers.utils.parseUnits("1.0", "ether"); 

    const txSetRegisterFee = await swapperContract.setRegisterFee(newFee);
    const rcSetRegisterFee = await txSetRegisterFee.wait();

    const registerFee = await swapperContract.getRegisterFee(); 
    expect(registerFee.toString()).to.equal(newFee.toString());

    const txSetSwapFee = await swapperContract.setSwapFee(newFee);
    const rcSetSwapFee = await txSetSwapFee.wait();

    const swapFee = await swapperContract.getSwapFee(); 
    expect(swapFee.toString()).to.equal(newFee.toString());
  });

  it("Register with fee", async function(){
    const bidder = ownerA.address;
    const offerNFTs = [erc721Contract.address, erc1155Contract.address];
    const offerTokenIds = [3, 3];
    const offerAmounts = [1, 2];
    const tendered = [ownerB.address];
    const demandNFTs = [erc721Contract.address, erc721Contract.address];
    const demandTokenIds = [intToBytes32(13), intToBytes32(14)];
    const demandAmounts = [1, 1];
    const tokensA = createTokens(offerNFTs, offerTokenIds, offerAmounts);
    const tokensB = createTokens(demandNFTs, demandTokenIds, demandAmounts);

    try{
      const txRegister = await swapperContract.connect(ownerA).register(bidder, tokensA, tendered, tokensB); 
      const reRegister = await txRegister.wait(); 
      console.log("register should fail due to insufficient fee");
      expect(false).to.equal(true);
    }catch(e){
      //console.log(e);
    }
     
    var balance = await ethers.provider.getBalance(swapperContract.address);
    expect(balance.toString()).to.equal("0");

    const fee = ethers.utils.parseEther("1.0");
    const txRegister = await swapperContract.connect(ownerA).register(bidder, tokensA, tendered, tokensB, { value: fee }); 
    const reRegister = await txRegister.wait(); 

    balance = await ethers.provider.getBalance(swapperContract.address);
    expect(balance.toString()).to.equal(fee.toString());
  });

  it("Swap with fee", async function(){
    const swapId = (await swapperContract.getSwapCount()).toNumber();

    try{
      const txSwap = await swapperContract.connect(ownerB).swap(swapId); 
      const reSwap = await txSwap.wait(); 
      console.log("swap should fail due to insufficient fee");
      expect(false).to.equal(true);
    }catch(e){
      //console.log(e);
    }

    const previousBalance = await ethers.provider.getBalance(swapperContract.address);

    const fee = ethers.utils.parseEther("2.0");
    const txSwap = await swapperContract.connect(ownerB).swap(swapId, { value: fee });
    const reSwap = await txSwap.wait(); 

    var balance = await ethers.provider.getBalance(swapperContract.address);
    expect(balance.toString()).to.equal((previousBalance.add(fee)).toString());

  });

  it("Withdraw", async function(){

    const contributors = await swapperContract.getContributors();
    expect(contributors.length).to.equal(2);
    const balances = [];
    for(var i = 0; i < contributors.length; i++){
      balances.push(await ethers.provider.getBalance(contributors[i]));
    }

    const previousBalance = await ethers.provider.getBalance(swapperContract.address);
    //console.log("previousBalance: " + ethers.utils.formatEther(previousBalance).toString(), " ether");

    try{
      const txWithdraw = await swapperContract.connect(ownerB).withdraw(); 
      const reWithdraw = await txWithdraw.wait(); 
      console.log("withdraw should fail by not a contributor");
      expect(false).to.equal(true);
    }catch(e){
      //console.log(e);
    }

    const txWithdraw = await swapperContract.connect(ownerA).withdraw();
    const reWithdraw = await txWithdraw.wait();

    var balance = await ethers.provider.getBalance(swapperContract.address);
    expect(balance.toString()).to.equal("0");

    var sum = ethers.BigNumber.from("0");
    for(var i = 0; i < contributors.length; i++){
       const newBalance = await ethers.provider.getBalance(contributors[i]); 
       const diff = newBalance.sub(balances[i]); 
       sum = sum.add(diff);
    }
    const loss = previousBalance.sub(sum).sub(reWithdraw.gasUsed.mul(1000000000)); 
    const isok = loss.lt(ethers.utils.parseEther("0.0000001"));
    if(!isok){
      console.log("loss: " + ethers.utils.formatEther(loss).toString() + " ether"); 
    }
    expect(isok).to.equal(true);
  });
 

  after("Finalize", async function () {
    [signer, ownerA, ownerB, ownerC] = await ethers.getSigners();  
    console.log("signer: " + signer.address, ", balance: ", await getBalance(signer));
    console.log("ownerA: " + ownerA.address, ", balance: ", await getBalance(ownerA),);
    console.log("ownerB: " + ownerB.address, ", balance: ", await getBalance(ownerB));
    console.log("ownerC: " + ownerC.address, ", balance: ", await getBalance(ownerC));
  })

  async function registerSwap(bidder, offerNFTs, offerTokenIds, offerAmounts, tendered, demandNFTs, demandTokenIds, demandAmounts) {
    const tokensA = createTokens(offerNFTs, offerTokenIds, offerAmounts);
    const tokensB = createTokens(demandNFTs, demandTokenIds, demandAmounts);
    const txRegister = await swapperContract.register(bidder, tokensA, tendered, tokensB); 
    const reRegister = await txRegister.wait();
    const [evRegister] = reRegister.events;  
    const swapId = evRegister.args.id.toNumber();
    return swapId;
  }
  function createTokens(addresses, tokenIds, amounts){
    const tokens = [];
    for(let i = 0; i < addresses.length; i++){
      const token = [addresses[i], intToBytes32(tokenIds[i]), amounts[i]];
      tokens.push(token);
    }
    return tokens;
  }
  function intToBytes32(int){
    return ethers.utils.hexZeroPad(ethers.utils.hexlify(int), 32);
  }
  function bytes32ToInt(bytes32){  
    return parseInt(bytes32);
  }

});

async function getBalance(address){
  const balance = await ethers.provider.getBalance(address.address);
  const ether = ethers.utils.formatEther(balance);
  const spent = 10000 - ether; 
  return ether + " ether, spent: " + spent.toFixed(6);
}
