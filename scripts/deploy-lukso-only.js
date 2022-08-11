require('dotenv').config();

async function main() {

  const [deployer] = await ethers.getSigners(0); 
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
	console.log("Signer:", deployer.address, ", balance: ", (await deployer.getBalance()).toString());
  console.log("Wallet:", wallet.address);

  const LSP7HandlerFactory = await ethers.getContractFactory("LSP7Handler"); 
  const LSP85HandlerFactory = await ethers.getContractFactory("LSP8Handler"); 

  const LSP7Handler = await LSP7HandlerFactory.deploy();  
  const LSP8Handler = await LSP85HandlerFactory.deploy(); 

  const NFTSWapper = await NFTSWapperFactory.deploy([LSP7Handler.address, LSP8Handler.address]);  

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