let debug = true;

const contracts = { 
  Mumbai: {
      NFT: {
          ERC721: {
              contract: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa",
              abiSwapper: ["function register(address ownerA, address[] memory nftAddressesA, uint256[] memory tokenIdsA, address ownerB, address[] memory nftAddressesB, uint256[] memory tokenIdsB, bool public_) external returns (uint256 swapId)"],
              abiNFT: [
                "function setApprovalForAll(address _operator, bool _approved) external", 
                "function isApprovedForAll(address _owner, address _operator) external view returns (bool)"
              ]
          }
      },
      id: 80001,
      scanner: "mumbai.polygonscan.com", 
  },
  Polygon: {
      NFT: {
          ERC721: {
              contract: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa",
              abiSwapper: [],
              abiNFT: ""
          },
          ERC1155: {
              contract: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa", 
              abiSwapper: [],
              abiNFT: "",
          }
      },
      id: 137,
      scanner: "polygonscan.com", 
  }
}

let provider, signer, signerAddress, connected, networkId, scanner, swapperAddress, contractURL, nftAbi, swapperAbi;

window.onload = async function(){ 

  selectSwapperContract({id: "init"});
  const url = new URL(window.location.href);
  const view = url.searchParams.get("view") || "register";
  document.getElementById("approve").style.display = "none";
  document.getElementById("register").style.display = "none";
  document.getElementById("deposit").style.display = "none";
  document.getElementById("claim").style.display = "none";
  if(view == "register"){
      document.getElementById("approve").style.display = "block";
      document.getElementById("register").style.display = "block";
  }

  if(window.ethereum){
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    //provider.on("network", (newNetwork, oldNetwork) => {if (oldNetwork) { window.location.reload();}});
    window.ethereum.on("accountsChanged", () => {window.location.reload();});
  }else{
    alert("Metamask not installed. Please consider installing it: https://metamask.io/download.html to use this dapp.");
  }

  await isMetaMaskConnected().then(async (isConnected) => {
    if (isConnected) {
      signer = await provider.getSigner(0); 
      signerAddress = await signer.getAddress();
      connected = signer !== null;
      if(connected){
        switchNetwork();
      }
      refreshConnectButton(); 
    } else {
        // metamask is not connected
    }
  });

  if(debug){
    document.getElementById("approveField").value = "0xF2e51312856FD2f86246b04A924BF49E197Ad0c5";
    document.getElementById("ownerA").value = "0xa4Fb556e27CC4024f092709e0B0Ed8A5617F23c3";
    document.getElementById("nftAddressesA").value = "0xF2e51312856FD2f86246b04A924BF49E197Ad0c5, 0xF2e51312856FD2f86246b04A924BF49E197Ad0c5";
    document.getElementById("tokensIdsA").value = "2, 3";
    document.getElementById("ownerB").value = "0x4443049b49Caf8Eb4E9235aA1Efe38FcFA0055a1";
    document.getElementById("nftAddressesB").value = "0x1bfbd4972346D6f3e8e2624D39283e894e2b9472";
    document.getElementById("tokensIdsB").value = "0";
  }

}

async function selectSwapperContract(e){
  const chainElement = document.getElementById("chains");
  const chain = chainElement.value;
  if(e.id == "init"){  
      Array.from(chainElement).forEach((option) => {
          chainElement.removeChild(option)
      });
      for (const key of Object.keys(contracts)) { 
          var opt = document.createElement('option');
          opt.value = key;
          opt.innerHTML = key;
          chainElement.appendChild(opt);
      }
      chainElement.value = chain;
      e.id = "chains";
  }
  const nftElement = document.getElementById('nfttype');
  if(e.id == "chains"){  
      Array.from(nftElement).forEach((option) => {
          nftElement.removeChild(option)
      });
      for (const key of Object.keys(contracts[chain].NFT)) {
          var opt = document.createElement('option');
          opt.value = key;
          opt.innerHTML = key;
          nftElement.appendChild(opt);
      }
  }  
  networkId = contracts[chain].id;
  scanner = contracts[chain].scanner; 
  swapperAbi = contracts[chain].NFT[nftElement.value].abiSwapper;
  swapperAddress = contracts[chain].NFT[nftElement.value].contract;
  contractURL = `https:/${scanner}/address/${swapperAddress}#code`;
  nftAbi = contracts[chain].NFT[nftElement.value].abiNFT; 
  
  document.getElementById("contractURL").href = contractURL;

  switchNetwork(); 
}

async function switchNetwork(){
  if(provider){
    const { chainId } = await provider.getNetwork()
    if(networkId !== chainId){  
      try { 
        await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${Number(networkId).toString(16)}` }], });
      } catch (switchError) { 
        if (switchError.code === 4902) {
          alert("Please connect to the correct network on Metamask"); 
        }else{
          alert("Error switching network"); 
        }
        return false;
      } 
    }
    return true;
  }
  return false;
}

const isMetaMaskConnected = async () => {
  const accounts = await provider.listAccounts();
  return accounts.length > 0;
}

// ##########################
 

async function connectButtonClicked(){
  if (typeof window.ethereum !== "undefined") {
    try {   
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner(0); 
      signerAddress = await signer.getAddress();
      connected = signer !== null;
      if(connected){
        switchNetwork();
      }
      refreshConnectButton(); 
    } catch (error) {
      console.error(error);
    }
  } else {
    connected = false;
    signerAddress = null;
    signer = null;
    document.getElementById("connectButton").innerHTML = "Connect";
    document.getElementById("connectButton").disabled = true;
    document.getElementById("connectLabel").innerHTML = "Please install MetaMask";
  } 
}

function refreshConnectButton(){
  document.getElementById("connectButton").innerHTML = connected ? 'Connected' : 'Connect';
  document.getElementById("connectLabel").innerHTML = connected ? signerAddress : "No address";
}

async function approveButtonClicked(e){ 

  if(!connected){
    await connectButtonClicked();
  }
  
  if(!connected){
    alert("Please connect to the correct network on Metamask");
    return;
  }

  const bytecode = await provider.getCode(e); 
  if(bytecode === '0x'){
      alert("Address is not a contract");
      return;
  } 
  const nftContract = new ethers.Contract(e, nftAbi, signer);
  const isApprovedForAll = await nftContract.isApprovedForAll(signerAddress, swapperAddress); 
  if(!isApprovedForAll){
      await nftContract.setApprovalForAll(swapperAddress, true)
  }else{
    alert("Swapper contract is already approved by given NFT Contract");
  } 
}

async function registerButtonClicked(){

  const ownerA = document.getElementById("ownerA").value.toString();
  const nftAddressesA = document.getElementById("nftAddressesA").value.replace(/\s/g, '').split(",");
  const tokensIdsA = document.getElementById("tokensIdsA").value.replace(/\s/g, '').split(",");
  const ownerB = document.getElementById("ownerB").value;
  const nftAddressesB = document.getElementById("nftAddressesB").value.replace(/\s/g, '').split(",");
  const tokensIdsB = document.getElementById("tokensIdsB").value.replace(/\s/g, '').split(",");
  const public = document.getElementById("publicSwap").checked;
  //if ownerB == 0 then it is a public swap
  console.log(ownerA);
  console.log(nftAddressesA);
  console.log(tokensIdsA);
  console.log(ownerB);
  console.log(nftAddressesB);
  console.log(tokensIdsB);
  console.log(public);
   
  const swapperContract = new ethers.Contract(swapperAddress, swapperAbi, signer);
  console.log(swapperContract);
  const registerTx = await swapperContract.register(ownerA, nftAddressesA, tokensIdsA, ownerB, nftAddressesB, tokensIdsB, public);
  //const registerTxHash = await registerTx.wait();
  console.log(registerTx);
}

function copyText(id){
  const text = document.getElementById(id); 
  navigator.clipboard.writeText(text.innerHTML);
}