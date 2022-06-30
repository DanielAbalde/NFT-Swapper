const { expect } = require("chai");
const { ethers } = require("hardhat");
var nftContract;

describe("Test721", function(){
  it("Mint NFTs", async function() {
    const [signer, ownerA, ownerB] = await ethers.getSigners();  

    const nftFactory = await ethers.getContractFactory("Test721");
    nftContract = await nftFactory.deploy();
    await nftContract.deployed();

    for(let i = 1; i < 5; i++) { 
      const responseA = await nftContract.mint(ownerA.address);
      const receiptA = await responseA.wait();
      const [transferEventA] = receiptA.events; 
      expect(transferEventA.args.tokenId.toNumber()).to.equal(i);
    }
    for(let i = 5; i < 10; i++) { 
      const responseB = await nftContract.mint(ownerB.address);
      const receiptB = await responseB.wait();
      const [transferEventB] = receiptB.events; 
      expect(transferEventB.args.tokenId.toNumber()).to.equal(i);
    }
  });
});

describe("ERC721Swapper", function () {
  let exContract;
  let signer, ownerA, ownerB, ownerC;

  it("Compile and approve nft contract", async function () {
    [signer, ownerA, ownerB, ownerC] = await ethers.getSigners();  
    console.log("signer: " + signer.address);
    console.log("ownerA: " + ownerA.address);
    console.log("ownerB: " + ownerB.address);
    console.log("ownerC: " + ownerC.address);

    const exFactory = await ethers.getContractFactory("ERC721Swapper");
    exContract = await exFactory.deploy();
    await exContract.deployed();

    const txApproveA = await nftContract.connect(ownerA).setApprovalForAll(exContract.address, true);
    const rcApproveA = await txApproveA.wait();
    const [evApproveA] = rcApproveA.events;  
    expect(evApproveA.args.approved).to.equal(true);

    const txApproveB = await nftContract.connect(ownerB).setApprovalForAll(exContract.address, true);
    const rcApproveB = await txApproveB.wait();
    const [evApproveB] = rcApproveB.events;  
    expect(evApproveB.args.approved).to.equal(true);

    const txApproveC = await nftContract.connect(ownerC).setApprovalForAll(exContract.address, true);
    const rcApproveC = await txApproveC.wait();
    const [evApproveC] = rcApproveC.events;  
    expect(evApproveC.args.approved).to.equal(true);
  });

  it("Register a new swap and get its swap data", async function () {
    
    const txRegister = await exContract.register(ownerA.address, [nftContract.address, nftContract.address], [1, 2], ownerB.address, [nftContract.address, nftContract.address], [5, 6]);
    const reRegister = await txRegister.wait();
    const [evRegister] = reRegister.events;  
    expect(evRegister.args.swapId.toNumber()).to.equal(1);

    const txGetSwaps = await exContract.connect(ownerA.address).getSwaps();
    const exId = txGetSwaps[0].toNumber();
    expect(exId).to.equal(1);

    const txGetSwap = await exContract.connect(ownerA.address).getSwap(exId);
    expect(txGetSwap.OwnerA).to.equal(ownerA.address);
    expect(txGetSwap.NFTContractA[0]).to.equal(nftContract.address);
    expect(txGetSwap.tokenIdsA[0].toNumber()).to.equal(1);
    expect(txGetSwap.OwnerB).to.equal(ownerB.address); 
    expect(txGetSwap.NFTContractB[0]).to.equal(nftContract.address);
    expect(txGetSwap.tokenIdsB[0].toNumber()).to.equal(5); 
  });

  it("Cancel a swap", async function () {

    const txRegister = await exContract.register(ownerA.address, [nftContract.address], [1], ownerB.address, [nftContract.address], [5]);
    const reRegister = await txRegister.wait();
    const [evRegister] = reRegister.events;   
    const exId = evRegister.args.swapId.toNumber();

    try{
      const txCancelC = await exContract.connect(ownerC.address).cancel(exId);
      console.log("Cancel an swap by non-owner should fail");
      expect(false).to.equal(true); 
    }catch(e){ 
    }
    
    const txCancel = await exContract.connect(ownerA).cancel(exId);
    const reCancel = await txCancel.wait();

    const txGetSwap = await exContract.connect(ownerA.address).getSwap(exId);
    expect(txGetSwap.StateA).to.equal(3); 
    expect(txGetSwap.StateB).to.equal(3); 
  });

  
  it("Deposit NFT", async function () {
 
    const addA = [nftContract.address];
    const idA = [3];
    const addB = [nftContract.address];
    const idB = [8];
    
    // Register
    const txRegister = await exContract.connect(ownerA).register(ownerA.address, addA, idA, ownerB.address, addB, idB);
    const reRegister = await txRegister.wait();
    const [evRegister] = reRegister.events;   
    let exId = evRegister.args.swapId.toNumber();
 
    // Deposit A check states
    const txDepositA = await exContract.connect(ownerA).deposit(exId, addA, idA);
    const reDepositA = await txDepositA.wait(); 
    expect(reDepositA.events[2].args.state).to.equal(1); 
    expect((await nftContract.ownerOf(idA[0]))).to.equal(exContract.address);

    const txGetSwapA = await exContract.connect(ownerA.address).getSwap(exId);
    expect(txGetSwapA.StateA).to.equal(1); 
    expect(txGetSwapA.StateB).to.equal(0); 
    expect((await exContract.connect(ownerA.address).getState(exId))).to.equal(0); 

    try{
      // Deposit other NFT should fail
      const txDepositF = await exContract.connect(ownerB).deposit(exId, addB, [9]);
      const reDepositF = await txDepositF.wait(); 
      console.log("Deposit other NFT should fail");
      expect(false).to.equal(true); 
    }catch(e){  
      //console.log(e);
    } 

    // Deposit B check states
    const txDepositB = await exContract.connect(ownerB).deposit(exId, addB, idB);
    const reDepositB = await txDepositB.wait(); 
    expect(reDepositB.events[2].args.state).to.equal(1); 
    expect((await nftContract.ownerOf(idB[0]))).to.equal(exContract.address);
 
    const txGetSwapB = await exContract.connect(ownerB.address).getSwap(exId);
    expect(txGetSwapB.StateA).to.equal(1); 
    expect(txGetSwapB.StateB).to.equal(1);
    expect((await exContract.connect(ownerA.address).getState(exId))).to.equal(1); 

    try{
      // Deposit again should fail
      const txDepositF = await exContract.connect(ownerB).deposit(exId, addB, idB);
      const reDepositF = await txDepositF.wait(); 
      console.log("Deposit again should fail");
      expect(false).to.equal(true); 
    }catch(e){  
      //console.log(e);
    } 

    try{
      // Deposit by not participant should fail
      const txDepositC = await exContract.connect(ownerC).deposit(exId, addB, idB);
      const reDepositC = await txDepositC.wait(); 
      console.log("Deposit by non-participant should fail");
      expect(false).to.equal(true); 
    }catch(e){ 
      //console.log(e);
    }  
  });

  it("Claim NFT", async function () {
    
  });
});
