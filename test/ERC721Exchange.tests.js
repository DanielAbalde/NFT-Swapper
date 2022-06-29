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

describe("ERC721Exchange", function () {
  it("Register a new exchange and get exchange", async function () {
    const [signer, ownerA, ownerB] = await ethers.getSigners();  

    const exFactory = await ethers.getContractFactory("ERC721Exchange");
    const exContract = await exFactory.deploy();
    await exContract.deployed();
   
    const txRegister = await exContract.register(ownerA.address, [nftContract.address, nftContract.address], [1, 2], ownerB.address, [nftContract.address, nftContract.address], [5, 6]);
    const reRegister = await txRegister.wait();
    const [evRegister] = reRegister.events;  
    expect(evRegister.args.exchangeId.toNumber()).to.equal(1);

    const txGetExchanges = await exContract.connect(ownerA.address).getExchanges();
    const exId = txGetExchanges[0].toNumber();
    expect(exId).to.equal(1);

    const txGetExchange = await exContract.connect(ownerA.address).getExchange(exId);
    expect(txGetExchange.OwnerA).to.equal(ownerA.address);
    expect(txGetExchange.NFTContractA[0]).to.equal(nftContract.address);
    expect(txGetExchange.tokenIdsA[0].toNumber()).to.equal(1);
    expect(txGetExchange.OwnerB).to.equal(ownerB.address); 
    expect(txGetExchange.NFTContractB[0]).to.equal(nftContract.address);
    expect(txGetExchange.tokenIdsB[0].toNumber()).to.equal(5); 
  });
});
