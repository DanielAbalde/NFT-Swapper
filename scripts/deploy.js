require('dotenv').config();

async function main() {

  const [deployer] = await ethers.getSigners(); 
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
	console.log("Signer:", deployer.address, ", balance: ", (await deployer.getBalance()).toString());
  console.log("Wallet:", wallet.address);

  const ERC721ExchangeFactory = await ethers.getContractFactory("ERC721Exchange"); 
  //const ERC1155ExchangeFactory = await ethers.getContractFactory("ERC1155Exchange"); 
 
  const ERC721Exchange = await ERC721ExchangeFactory.deploy();  
  //const ERC1155Exchange = await ERC1155ExchangeFactory.deploy();  

  console.log("ERC721Exchange deployed to:", ERC721Exchange.address); 
  //console.log("ERC1155Exchange deployed to:", ERC1155Exchange.address); 
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });