require('dotenv').config();

async function main() {
  const [deployer] = await ethers.getSigners(0); 
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
	console.log("Signer:", deployer.address, ", balance: ", (await deployer.getBalance()).toString());
  console.log("Wallet:", wallet.address);

  const ERC721HandlerFactory = await ethers.getContractFactory("ERC721Handler"); 
  const ERC1155HandlerFactory = await ethers.getContractFactory("ERC1155Handler"); 
  const LSP7HandlerFactory = await ethers.getContractFactory("LSP7Handler"); 
  const LSP85HandlerFactory = await ethers.getContractFactory("LSP8Handler"); 
  const NFTSWapperFactory = await ethers.getContractFactory("NFTSwapper"); 
 
  const ERC721Handler = await ERC721HandlerFactory.deploy();  
  const ERC1155Handler = await ERC1155HandlerFactory.deploy();  
  const LSP7Handler = await LSP7HandlerFactory.deploy();  
  const LSP8Handler = await LSP85HandlerFactory.deploy(); 
  const NFTSWapper = await NFTSWapperFactory.deploy();  
 
  const handlers = [ERC721Handler.address, ERC1155Handler.address, LSP7Handler.address, LSP8Handler.address];
  for(let i = 0; i < handlers.length; i++) { 
    const txSupportStandards = await NFTSWapper.supportStandard(handlers[i]);
    await txSupportStandards.wait();
  }

  console.log("ERC721Handler deployed to:", ERC721Handler.address); 
  console.log("ERC1155Handler deployed to:", ERC1155Handler.address); 
  console.log("LSP7Handler deployed to:", LSP7Handler.address); 
  console.log("LSP8Handler deployed to:", LSP8Handler.address); 
  console.log("NFTSWapper deployed to:", NFTSWapper.address);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });