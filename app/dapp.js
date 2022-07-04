
var url = new URL(window.location.href);
var web3;
 
const contracts = { 
    Mumbai: {
        ERC721: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa", 
        scanner: "mumbai.polygonscan.com",
        endpoint: API_URL_MUMBAI
    },
    Polygon: {
        ERC721: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa", 
        ERC1155: "0x68fE05bA6C9bd7d43FF255f4D90D8508a605dBfa", 
        scanner: "polygonscan.com",
        endpoint: API_URL_MATIC
    }
}

window.onload = async function(){ 
    await startDApp(); 
    selectSwapperContract({id: "init"});

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
    const chain = document.getElementById('chains').value;
    if(e.id == "init"){  

        e.id = "chains";
    }
    const nftElement = document.getElementById('nfttype');
    if(e.id == "chains"){  
        Array.from(nftElement).forEach((option) => {
            nftElement.removeChild(option)
        });
        for (const key of Object.keys(contracts[chain])) {
            if(key != 'scanner' && key != 'endpoint'){
                var opt = document.createElement('option');
                opt.value = key;
                opt.innerHTML = key;
                nftElement.appendChild(opt);
            }
        }
    }  
    const scanner = contracts[chain].scanner;
    const address = contracts[chain][nftElement.value];
    const url = `https:/${scanner}/address/${address}#code`;
    document.getElementById("contractURL").href = url;

    web3 = new Web3(contracts[chain].endpoint);
}
 
function getUrlValue(name, defaultValue){
	var value = url.searchParams.get(name);
	if(value){  
    if (typeof defaultValue == "boolean") {
			return parseBoolean(value);
		}
		else if (typeof defaultValue == "number") {
			if(value.startsWith("0x"))
				return parseInt(value);
			return parseFloat(value);
		}
		return value;
	}else{
		return defaultValue;
	}
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
   
 
 