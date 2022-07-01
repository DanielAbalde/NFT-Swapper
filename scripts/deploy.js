require('dotenv').config();

async function main() {

  const [deployer] = await ethers.getSigners(); 
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
	console.log("Signer:", deployer.address, ", balance: ", (await deployer.getBalance()).toString());
  console.log("Wallet:", wallet.address);

  const ERC721SwapperFactory = await ethers.getContractFactory("ERC721Swapper"); 
  //const ERC1155SwapperFactory = await ethers.getContractFactory("ERC721Swapper"); 
 
  const ERC721Swapper = await ERC721SwapperFactory.deploy();  
  //const ERC1155Exchange = await ERC1155SwapperFactory.deploy();  

  console.log("ERC721Swapper deployed to:", ERC721Swapper.address); 
  //console.log("ERC1155Swapper deployed to:", ERC1155Swapper.address); 
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });