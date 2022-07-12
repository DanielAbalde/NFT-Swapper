//require('dotenv').config();

const contracts = { 
    Mumbai: {
        NFT: {
            ERC721: {
                contract: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa",
                abi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]

            }
        },
        scanner: "mumbai.polygonscan.com",
        endpoint: "https://polygon-mumbai.g.alchemy.com/v2/BnTuLPz_oLBquoWP83A069FUfGQHJpO" // process.env.API_URL_MUMBAI
    },
    Polygon: {
        NFT: {
            ERC721: {
                contract: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa",
                abi: [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"operator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}]
            },
            ERC1155: {
                contract: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa", 
                abi: "",
            }
        },
        scanner: "polygonscan.com",
        endpoint: "https://polygon-mumbai.g.alchemy.com/v2/BnTuLPz_oLBquoWP83A069FUfGQHJpO2" // process.env.API_URL_MUMBAI
    }
}

let scanner, contractAddress, contractURL, nftAbi, web3;

window.onload = async function(){ 
    await startDApp(); 
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
}
 
async function connectButtonClicked(){
    try { 
		await ethereum.request({ method: 'eth_requestAccounts' });
		//console.log(ethWalletAvaliable, ethWalletConnected);
        refreshConnectStep(); 
        //let disabled = !ethWalletAvaliable || ethWalletConnected;
	    //butConnect.elt.disabled = disabled;
	} catch (error) {
		console.error(error);
	}
}

function refreshConnectStep(){
    const button = document.getElementById("connectButton");
    button.innerHTML = ethWalletAvaliable ? (ethWalletConnected ? 'Connected' : 'Connect') : 'MetaMask not installed';
    var p = document.getElementById("connectLabel");
    p.innerHTML = ethWalletConnected ? ethWalletAccount : "No address";
}
 
function selectSwapperContract(e){
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
    scanner = contracts[chain].scanner; 
    contractAddress = contracts[chain].NFT[nftElement.value].contract;
    contractURL = `https:/${scanner}/address/${contractAddress}#code`;
    nftAbi = contracts[chain].NFT[nftElement.value].abi;

    document.getElementById("contractURL").href = contractURL;
    console.log(nftAbi);

    if (typeof web3 !== 'undefined'){
        web3 = new Web3(web3.currentProvider);
    }else{
        web3 = new Web3(contracts[chain].endpoint);
    } 
    console.log(web3);
}

async function approveOnClick(e){ 
    if(await web3.eth.getCode(e) === '0x'){
        alert("Address is not a contract");
        return;
    }
    const contract = new web3.eth.Contract(nftAbi, e);
    const approve = await contract.methods.setApprovalForAll(contractAddress, true).send({ from: ethWalletAccount});
    console.log(approve);
}
  
ethereum.on('accountsChanged', handleAccountsChanged);
 
let ethWalletAvaliable;
let ethWalletConnected;
let ethWalletAccount; 
let ethWalletAccounts;

async function startDApp() {
    const provider = await detectEthereumProvider(); 
    if (provider) { 
      if (provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed? window.ethereum is overwritted');
        ethWalletAvaliable = false;
      }
      ethWalletAvaliable = true;
      const re = await isWalletConnected();   
      refreshConnectStep(); 
    } else {
      console.log('Please install MetaMask!');
      ethWalletAvaliable = false;
    } 
 }

 // https://www.npmjs.com/package/@metamask/detect-provider
 function detectEthereumProvider({ mustBeMetaMask = false, silent = false, timeout = 3000, } = {}) {
  _validateInputs();
  let handled = false;
  return new Promise((resolve) => {
      if (window.ethereum) {
          handleEthereum();
      }
      else {
          window.addEventListener('ethereum#initialized', handleEthereum, { once: true });
          setTimeout(() => {
              handleEthereum();
          }, timeout);
      }
      function handleEthereum() {
          if (handled) {
              return;
          }
          handled = true;
          window.removeEventListener('ethereum#initialized', handleEthereum);
          const { ethereum } = window;
          if (ethereum && (!mustBeMetaMask || ethereum.isMetaMask)) {
              resolve(ethereum);
          }
          else {
              const message = mustBeMetaMask && ethereum
                  ? 'Non-MetaMask window.ethereum detected.'
                  : 'Unable to detect window.ethereum.';
              !silent && console.error('@metamask/detect-provider:', message);
              resolve(null);
          }
      }
  });
  function _validateInputs() {
      if (typeof mustBeMetaMask !== 'boolean') {
          throw new Error(`@metamask/detect-provider: Expected option 'mustBeMetaMask' to be a boolean.`);
      }
      if (typeof silent !== 'boolean') {
          throw new Error(`@metamask/detect-provider: Expected option 'silent' to be a boolean.`);
      }
      if (typeof timeout !== 'number') {
          throw new Error(`@metamask/detect-provider: Expected option 'timeout' to be a number.`);
      }
  }
}
 
async function isWalletConnected(){
  await ethereum.request({ method: 'eth_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => { 
    console.error(err);
  }); 
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    let wasConnected = ethWalletConnected;
    ethWalletConnected = false;
    ethWalletAccount = null;
    ethWalletAccounts = null; 
    console.log('Please connect to MetaMask.');
    if(wasConnected)
      window.location.reload();
  } else if (accounts[0] !== ethWalletAccount) {
    ethWalletConnected = true;
    ethWalletAccounts = accounts;
    ethWalletAccount = accounts[0]; 
    console.log('Connected.');
  }
}

function reduceAddress(address, start = 3, end = 4){
  let s = address.toString();
  return s.substring(0, start + 2).concat('...', s.substring(s.length - end)); 
}
/*
window.ethereum.on('connect', function (info) { 
  console.log('connect ' , info);
})

window.ethereum.on('disconnect', function (info) { 
  console.log('disconnect ' + info);
})


window.ethereum.on('accountsChanged', function (accounts) { 
  console.log('accountsChanged ' + accounts);
})
*/
window.ethereum.on('chainChanged', function (networkId) { 
  console.log('chainChanged ' + networkId);
  window.location.reload();
})

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}
 
async function getAccountsAsync(){ 
  ethWalletAccounts = await ethereum.request({ method: 'eth_requestAccounts' });
  return ethWalletAccounts;
}
   
 
 