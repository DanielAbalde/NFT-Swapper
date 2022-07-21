
let debug = false;

const contracts = { 
  Mumbai: {
      NFT: {
          ERC721: {
              contract: "0xEd1D7d05d79AB4F980FBAB452bCD4da365a66548",
              abiSwapper: [
                {
                  "anonymous": false,
                  "inputs": [
                    {
                      "indexed": true,
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    },
                    {
                      "indexed": true,
                      "internalType": "enum NFTSwapper.SwapState",
                      "name": "state",
                      "type": "uint8"
                    }
                  ],
                  "name": "SwapStateChanged",
                  "type": "event"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    }
                  ],
                  "name": "cancel",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    }
                  ],
                  "name": "claim",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address[]",
                      "name": "nftAddresses",
                      "type": "address[]"
                    },
                    {
                      "internalType": "uint256[]",
                      "name": "tokenIds",
                      "type": "uint256[]"
                    }
                  ],
                  "name": "deposit",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "deposited",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    }
                  ],
                  "name": "getState",
                  "outputs": [
                    {
                      "internalType": "enum NFTSwapper.SwapState",
                      "name": "",
                      "type": "uint8"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    }
                  ],
                  "name": "getSwap",
                  "outputs": [
                    {
                      "components": [
                        {
                          "internalType": "uint256",
                          "name": "Id",
                          "type": "uint256"
                        },
                        {
                          "internalType": "enum NFTSwapper.SwapState",
                          "name": "StateA",
                          "type": "uint8"
                        },
                        {
                          "internalType": "address",
                          "name": "OwnerA",
                          "type": "address"
                        },
                        {
                          "internalType": "address[]",
                          "name": "NFTContractA",
                          "type": "address[]"
                        },
                        {
                          "internalType": "uint256[]",
                          "name": "TokenIdsA",
                          "type": "uint256[]"
                        },
                        {
                          "internalType": "enum NFTSwapper.SwapState",
                          "name": "StateB",
                          "type": "uint8"
                        },
                        {
                          "internalType": "address",
                          "name": "OwnerB",
                          "type": "address"
                        },
                        {
                          "internalType": "address[]",
                          "name": "NFTContractB",
                          "type": "address[]"
                        },
                        {
                          "internalType": "uint256[]",
                          "name": "TokenIdsB",
                          "type": "uint256[]"
                        },
                        {
                          "internalType": "bool",
                          "name": "Public",
                          "type": "bool"
                        }
                      ],
                      "internalType": "struct NFTSwapper.Swap",
                      "name": "",
                      "type": "tuple"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "getSwapCount",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "nft",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "tokenId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address",
                      "name": "account",
                      "type": "address"
                    }
                  ],
                  "name": "isOwnerOf",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "ownerA",
                      "type": "address"
                    },
                    {
                      "internalType": "address[]",
                      "name": "nftAddressesA",
                      "type": "address[]"
                    },
                    {
                      "internalType": "uint256[]",
                      "name": "tokenIdsA",
                      "type": "uint256[]"
                    },
                    {
                      "internalType": "address",
                      "name": "ownerB",
                      "type": "address"
                    },
                    {
                      "internalType": "address[]",
                      "name": "nftAddressesB",
                      "type": "address[]"
                    },
                    {
                      "internalType": "uint256[]",
                      "name": "tokenIdsB",
                      "type": "uint256[]"
                    },
                    {
                      "internalType": "bool",
                      "name": "public_",
                      "type": "bool"
                    }
                  ],
                  "name": "register",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "swapId",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "from",
                      "type": "address"
                    },
                    {
                      "internalType": "address[]",
                      "name": "nftAddresses",
                      "type": "address[]"
                    },
                    {
                      "internalType": "uint256[]",
                      "name": "tokenIds",
                      "type": "uint256[]"
                    },
                    {
                      "internalType": "address",
                      "name": "to",
                      "type": "address"
                    }
                  ],
                  "name": "transferBatchOwnership",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "from",
                      "type": "address"
                    },
                    {
                      "internalType": "address",
                      "name": "nftAddress",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "tokenId",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address",
                      "name": "to",
                      "type": "address"
                    }
                  ],
                  "name": "transferOwnership",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
              ],
              abiNFT: [
                "function setApprovalForAll(address _operator, bool _approved) external", 
                "function isApprovedForAll(address _owner, address _operator) external view returns (bool)",
                "function tokenURI(uint256 tokenId) external view returns (string memory)",
                "function name() external view returns (string memory)"
              ]
          }
      },
      id: 80001,
      scanner: "mumbai.polygonscan.com", 
  },
  Polygon: {
      NFT: {
          ERC721: {
              contract: "0xEd1D7d05d79AB4F980FBAB452bCD4da365a66548",
              abiSwapper: [],
              abiNFT: ""
          },/*
          ERC1155: {
              contract: "", 
              abiSwapper: [],
              abiNFT: "",
          }*/
      },
      id: 137,
      scanner: "polygonscan.com", 
  }
}

let provider, signer, signerAddress, connected, networkId, scanner, swapperAddress, contractURL, nftAbi, swapperAbi;
let swapperContract = undefined;
let waiting = false;

window.onload = async function(){ 

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
      const {name} = await provider.getNetwork();
      console.log(`Connected ${signerAddress} on ${name}`);
    } else {
      console.log("Not connected");
    }
  });

  await selectSwapperContract({id: "init"});


  document.getElementById("connectToAccess").innerHTML = connected ? "" : "Connect to access. 🔑";
  document.getElementById("approve").style.display = "none";
  document.getElementById("register").style.display = "none";
  document.getElementById("profile").style.display = "none";
  if(connected){ 
    const url = new URL(window.location.href);
    const view = url.searchParams.get("view") || "register";
    if(view == "register"){
      document.getElementById("approve").style.display = "block";
      document.getElementById("register").style.display = "block";
    }else if(view == "profile"){
      document.getElementById("profile").style.display = "block";
      displayProfile();
    } 
  }
 
  if(debug){
    const sample = 2;
    switch(sample){
      case 0:
        document.getElementById("approveField").value = "0xF2e51312856FD2f86246b04A924BF49E197Ad0c5";
        document.getElementById("ownerA").value = "0xa4Fb556e27CC4024f092709e0B0Ed8A5617F23c3";
        document.getElementById("nftAddressesA").value = "0xF2e51312856FD2f86246b04A924BF49E197Ad0c5, 0xF2e51312856FD2f86246b04A924BF49E197Ad0c5";
        document.getElementById("tokensIdsA").value = "2, 3";
        document.getElementById("ownerB").value = "0x4443049b49Caf8Eb4E9235aA1Efe38FcFA0055a1";
        document.getElementById("nftAddressesB").value = "0x1bfbd4972346D6f3e8e2624D39283e894e2b9472";
        document.getElementById("tokensIdsB").value = "0";
      break;
      case 1:
        document.getElementById("approveField").value = "0xe1600c43b7113b5eb18d6b2f4f5d4189ad27f9b0";
        document.getElementById("ownerA").value = "0x4443049b49Caf8Eb4E9235aA1Efe38FcFA0055a1";
        document.getElementById("nftAddressesA").value = "0xe1600c43b7113b5eb18d6b2f4f5d4189ad27f9b0";
        document.getElementById("tokensIdsA").value = "1";
        document.getElementById("ownerB").value = "0xa4Fb556e27CC4024f092709e0B0Ed8A5617F23c3";
        document.getElementById("nftAddressesB").value = "0xf2e51312856fd2f86246b04a924bf49e197ad0c5";
        document.getElementById("tokensIdsB").value = "0";
        break;
      case 2:
        document.getElementById("approveField").value = "0xe1600c43b7113b5eb18d6b2f4f5d4189ad27f9b0";
        document.getElementById("ownerA").value = "0x4443049b49Caf8Eb4E9235aA1Efe38FcFA0055a1";
        document.getElementById("nftAddressesA").value = "0x1bfbd4972346d6f3e8e2624d39283e894e2b9472";
        document.getElementById("tokensIdsA").value = "1";
        document.getElementById("ownerB").value = "0xa4Fb556e27CC4024f092709e0B0Ed8A5617F23c3";
        document.getElementById("nftAddressesB").value = "0x346f6a9ce8a90348c829dbc2d012f4cf0c32624b";
        document.getElementById("tokensIdsB").value = "0";
        break;
    }

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

  if(e.id === "init")
  await switchNetwork(); 
 
}

async function switchNetwork(){ 
  if(provider){
    if(networkId === undefined)
      networkId = contracts[document.getElementById("chains").value].id;
    const { chainId } = await provider.getNetwork();
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

function getSwapperContract(){
  if(swapperContract !== undefined)
    return swapperContract;

  swapperContract = new ethers.Contract(swapperAddress, swapperAbi, signer);
  if(swapperContract !== undefined){
    swapperContract.on("SwapStateChanged", OnSwapStateChanged);
  } 
  return swapperContract;
}

const isMetaMaskConnected = async () => {
  const accounts = await provider.listAccounts();
  return accounts.length > 0;
}
 
// ##########################
 
async function OnSwapStateChanged(swapId, state){
  const swap = await getSwapperContract().getSwap(swapId);
  if(swap.OwnerA === signerAddress || swap.OwnerB === signerAddress || debug){
    console.log(`State of SwapID ${swapId.toNumber()} changed to "${translateState(state)}"`);
    if(swap.StateA === 0 && swap.StateB === 0){
      const label = document.getElementById("registeredId"); 
      label.style.display = "block";
      label.innerHTML = `Your swap ID is: <span style="font-size:200%;">${swapId}</span>.`;
      label.scrollIntoView();
    }else if(swap.StateA === 2 && swap.StateB === 2){
      alert("🎉 Exchange successfully completed! 🎉");
    }
  }
}

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
      alertError(error);
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

  try{
    const nftContract = new ethers.Contract(e, nftAbi, signer); 
    const isApprovedForAll = await nftContract.isApprovedForAll(signerAddress, swapperAddress); 
    if(!isApprovedForAll){
      displayLoading(true);
        await nftContract.setApprovalForAll(swapperAddress, true)
    }else{
      alert("Swapper contract is already approved by given NFT Contract");
    } 
  }catch(err){
    alertError(err);
  }


  displayLoading(false);
}

async function registerButtonClicked(){

  function getValue(id){
    if(id.startsWith("owner")){
      var value = document.getElementById(id).value;
      if(value !== undefined){
        return value.toString();
      }
      return "";
    }
    else if(id.startsWith("nftAddresses")){
      var value = document.getElementById(id).value;
      if(value !== undefined){
        return value.replace(/\s/g, '').split(",");
      }
      return "";
    }
    else if(id.startsWith("tokensIds")){
      var value = document.getElementById(id).value;
      if(value !== undefined){
        return value.replace(/\s/g, '').split(",");
      }
      return "";
    }
  }

  const ownerA = getValue("ownerA");
  const nftAddressesA = getValue("nftAddressesA");
  const tokenIdsA = getValue("tokensIdsA");
  const ownerB = getValue("ownerB") || ethers.constants.AddressZero;
  const nftAddressesB = getValue("nftAddressesB");
  const tokenIdsB = getValue("tokensIdsB");
  const public = document.getElementById("publicSwap").value;

  //if ownerB == 0 then it is a public swap.0
  /*console.log(ownerA);
  console.log(nftAddressesA);
  console.log(tokenIdsA);
  console.log(ownerB);
  console.log(nftAddressesB);
  console.log(tokenIdsB);
  console.log(public);*/

  try{
   
    const registerTx = await getSwapperContract().register(ownerA, nftAddressesA, tokenIdsA, ownerB, nftAddressesB, tokenIdsB, public);
    const button = document.getElementById("registerButton");
    button.value = "Waiting...";
    button.disabled = true; 
    displayLoading(true);
    const registerRc = await registerTx.wait();
    console.log(registerRc);
    button.value = "Registered";
    button.disabled = false; 

  }catch(error){
    alertError(error)
  }
  
  displayLoading(false);
}

async function swapButtonClicked(e){
   
  const card = e.target.closest(".swapCard"); 
  const swapId = card.swapId;
  
  try{
    let swap = await getSwapperContract().getSwap(swapId);
    if(swap.OwnerA !== signerAddress && swap.OwnerB !== signerAddress){
      console.error("Not a participant");
      return;
    }   
    const isA = swap.OwnerA === signerAddress;
    const owner = isA ? swap.OwnerA : swap.OwnerB;
    const state = isA ? swap.StateA : swap.StateB;
    const button = card.querySelector(`#actionSwapButton${isA ? "A" : "B"}`);
    if(state === 0){
      const nfts = isA ? swap.NFTContractA : swap.NFTContractB;
      const ids = (isA ? swap.TokenIdsA : swap.TokenIdsB).map(n => n.toNumber());
      let exit = false;
      for(var i=0; i<nfts.length; i++){
        const nftContract = new ethers.Contract(nfts[i], nftAbi, signer);
        const approved = await nftContract.isApprovedForAll(owner, swapperAddress);
        if(!approved){
          exit = true;
          alert("First you need to give permissions to the Swapper contract to transfer your NFT(s). Please sign a \"setApproveForAll\" transaction on Metamask on each NFT contract address. Once completed, click on \"Deposit\" again.");
          displayLoading(true); 
          const approveTx = await nftContract.setApprovalForAll(swapperAddress, true);
          const isApproved = await nftContract.isApprovedForAll(signerAddress, swapperAddress);
          console.log(isApproved);
          if(isApproved){
            alert("Approval for Swapper contract was successfully set.");
          }else{
            alert("Approval for Swapper contract was not set.");
          } 
        }
      }
      if(exit)
        return;

      button.innerHTML = "Depositing...";
      button.disabled = true; 
      const depositTx = await getSwapperContract().deposit(swapId, nfts, ids);
      displayLoading(true);
      const depositRc = await depositTx.wait();
      console.log(depositRc);
    }
    else if(state === 1)
    {
      button.innerHTML = "Claiming...";
      button.disabled = true;
      const claimTx = await getSwapperContract().claim(swapId);
      displayLoading(true)
      const claimRc = await claimTx.wait();
      console.log(claimRc);
    }

  }catch(error){
    alertError(error);
  }

  await refreshSwapCard(swapId);

  displayLoading(false);

  return true;
}

async function cancelSwapButtonClicked(e){
   
  const card = e.target.closest(".swapCard"); 
  const swapId = card.swapId;
 
  e.target.disabled = true;
  e.target.innerHTML = "Cancelling...";

  try{  
    const cancelTx = await getSwapperContract().cancel(swapId); console.log("OJ");
    displayLoading(true);
    const cancelRc = await cancelTx.wait();
    console.log(cancelRc);
  }catch(error){
    alertError(error);
  }

  await refreshSwapCard(swapId);

  displayLoading(false);
}

async function refreshSwapCard(swapId){

  const swap = await getSwapperContract().getSwap(swapId);
  const card = document.getElementById(`swapCard${swapId}`);
  if(card === undefined)
    return;

  const swapState = getState(swap);
  const swapStateS = translateStateWithEmoji(swapState);

  //card.querySelector("#swapCardTitle").innerHTML = `ID: ${swap.Id}  |  Public: ${swap.Public}  |  State: <b>${swapStateS}</b>`;
  card.querySelector("#swapCardTitle").innerHTML = `ID: ${swap.Id}  |  State: <b>${swapStateS}</b>`;
  card.querySelector("#swapParticipantStateA").innerHTML = translateStateWithEmoji(swap.StateA);
  card.querySelector("#swapParticipantStateB").innerHTML = translateStateWithEmoji(swap.StateB); 

  const isA = swap.OwnerA === signerAddress;
  const isB = swap.OwnerB === signerAddress;
  const isPending = swapState === 0;
  const isDeposited = swap.StateA === 1 && swap.StateB === 1; 
  const isClaimed = swap.StateA === 2 || swap.StateB === 2;
  const isCancelled = swap.StateA === 3 || swap.StateB === 3;

  const cancelA = card.querySelector("#cancelSwapButtonA");
  cancelA.innerHTML = "Cancel";
  cancelA.disabled = !isA || isClaimed || isCancelled;
  const cancelB = card.querySelector("#cancelSwapButtonB");
  cancelB.innerHTML = "Cancel";
  cancelB.disabled = !isB || isClaimed || isCancelled;

  const actionA = card.querySelector("#actionSwapButtonA");
  if(swap.StateA === 1){
    actionA.innerHTML = "Claim";
    actionA.disabled = !isA || isClaimed || isCancelled || swap.StateB !== 1;
  }else{
    actionA.innerHTML = "Deposit";
    actionA.disabled = !isA || !isPending;
  }

  const actionB = card.querySelector("#actionSwapButtonB");
  if(swap.StateB === 1){
    actionB.innerHTML = "Claim";
    actionB.disabled = !isB || isClaimed || isCancelled || swap.StateA !== 1;
  }else{
    actionB.innerHTML = "Deposit";
    actionB.disabled = !isB || !isPending;
  }
}

function displayLoading(show){
  waiting = show === undefined ? (waiting ? false : true) : show;
  const loadE = document.getElementById("loadingSplash");
  loadE.style.zIndex = waiting ? 999 : -1;
  loadE.style.opacity = waiting ? 1 : 0;
  loadE.style.display = waiting ? "block" : "none"; 
  loadE.style.top =  window.scrollY + "px"; 
  document.body.style.overflow = waiting ? "hidden" : "auto";
}

// ##########################
 

async function displayProfile(){
  try{
    const profile = document.getElementById("profile");
    const swapperContract = getSwapperContract();
    if(connected && swapperContract !== undefined){  
      const swaps = [];
      try{
        const swapCount = await swapperContract.getSwapCount(); 
        const count = swapCount.toNumber();  
        const filter = document.getElementById("profileFilter").value;
        for(var i=1; i<=count; i++){ 
          try{
            const swap = await swapperContract.getSwap(i); 
            if(swap.OwnerA !== signerAddress && swap.OwnerB !== signerAddress)
              continue; 
            if(filter === "All"){
              swaps.push(swap); 
            }else{
              if(translateState(getState(swap)) === filter){
                swaps.push(swap);
              }
            } 
          }catch(e){
            console.error("Error getting swap ", i, {e});
          } 
        }  
      }catch(e){
        console.error("Error getting swap count", {e});
      }
      
    
      profile.querySelector("#loadingSwaps").style.display = "none";
      if(profile.childNodes.length >= 5){
        for(var i=profile.childNodes.length-1; i>=5; i--){
          if(profile.childNodes[i].nodeName === "DIV"){
            profile.removeChild(profile.childNodes[i])
          }
        }
      } 
      if(swaps.length == 0){
        const div = document.createElement("div");
        div.className = "swapCard";
        div.innerHTML = "No swaps found";
        profile.appendChild(div);
      }else{
        const pageSize = 5;
        const pageCount = Math.ceil(swaps.length / pageSize); 
        const url = new URL(window.location.href);
        const pageS = url.searchParams.get("page") || "1";
        const page = Math.max(1, Math.min(pageCount, parseInt(pageS)));
        const start = (page - 1 ) * pageSize;
  
        if(swaps.length > pageSize){ 
          profile.appendChild(createPagination(pageCount, page));
        }
  
        for(var i=start; i<start + Math.min(pageSize, swaps.length); i++){
          if(i >= swaps.length)
            break;
          const swapE = await createSwapElement(swaps[i]);
          profile.appendChild(swapE);
          refreshSwapCard(swaps[i].Id);
        } 
  
        if(swaps.length > pageSize){ 
          profile.appendChild(createPagination(pageCount, page));
        }
      } 
    }else{
      profile.innerHTML="No connected";
    }
 
  }catch(error){
    console.error({error});
  }

}

function createPagination(pageCount, page){
 
  const div = document.createElement("div");
  div.className = "pagination";
  const a0 = document.createElement("a");
  a0.href = `?view=profile&page=${page-1}`;
  a0.innerHTML = "&lt;&lt;";
  if(page <= 1)
    a0.style = "pointer-events:none;";
  div.appendChild(a0);
  for(var i=0; i<pageCount; i++){
    const a = document.createElement("a");
    a.href = `?view=profile&page=${i+1}`;
    a.innerHTML = `${i+1}`;
    if(i == page-1){
      a.style = "font-weight:bold; text-decoration:underline;";
    }
    div.appendChild(a);
  }
  const a1 = document.createElement("a");
  a1.href = `?view=profile&page=${page+1}`;
  a1.innerHTML = "&gt;&gt;";
  if(page >= pageCount)
    a1.style = "pointer-events:none;";
  div.appendChild(a1);
  return div;
}

async function createSwapElement(swap){  

  const stateIndex = getState(swap);
  const swapState = translateState(stateIndex);
  const swapStateE = translateStateWithEmoji(stateIndex);
  const div = document.createElement("div");
  div.className = "swapCard";
  div.swapId = swap.Id.toNumber(); 
  div.id = `swapCard${swap.Id.toNumber()}`;
  const idE = document.createElement("p");
  idE.className = "swapCardId";
  idE.id = "swapCardTitle";
  //idE.innerHTML = `ID: ${swap.Id}  |  Public: ${swap.Public}  |  State: <b>${swapState}</b>`;
  idE.innerHTML = `ID: ${swap.Id}  |  State: <b>${swapStateE}</b>`;
  div.appendChild(idE); 

  const groupE = document.createElement("div");
  groupE.className = "swapCardGroup";
  div.appendChild(groupE);
  
  const groupA = await createParticipantElement(swap.OwnerA, swap.StateA, swap.NFTContractA, swap.TokenIdsA, swapState, "A");
  groupE.appendChild(groupA);
  
  const groupS = document.createElement("div");
  groupS.className = "swapCardGroupSeparator";
  groupE.appendChild(groupS);

  const groupB = await createParticipantElement(swap.OwnerB, swap.StateB, swap.NFTContractB, swap.TokenIdsB, swapState, "B");
  groupE.appendChild(groupB);

  return div;
}

async function createParticipantElement(owner, state, contracts, tokens, swapState, side){

  const div = document.createElement("div");
  div.className = "swapCardGroupColumn"; 
 
  const divTop = document.createElement("div");
  divTop.className = "swapCardGroupColumnDiv swapCardGroupColumnTop"; 
  div.appendChild(divTop);

  const ownerE = document.createElement("a");
  ownerE.className = "swapCardTokenText";
  ownerE.innerHTML = owner === ethers.constants.AddressZero ? "Any address" : owner;
  if(owner !== ethers.constants.AddressZero){
    ownerE.target = "_blank";
    ownerE.href = `https:/${scanner}/address/${owner}`; 
  }

  divTop.appendChild(ownerE);

  const stateE = document.createElement("div");
  stateE.className = "swapCardTokenText";
  stateE.id = `swapParticipantState${side}`;
  stateE.style = "font-style: italic; padding-bottom:15px;"; 
  stateE.innerHTML = translateStateWithEmoji(state);
  divTop.appendChild(stateE);

  const divMid = document.createElement("div");
  divMid.className = "swapCardGroupColumnDiv";  
  div.appendChild(divMid);

  for(var i=0; i<contracts.length; i++){
    const contract = contracts[i];
    const tokenId = tokens[i].toNumber(); 
    const tokenE = await createTokenElement(contract, tokenId);
    divMid.appendChild(tokenE);
  }

  const divBot = document.createElement("div");
  divBot.className = "swapCardGroupColumnDiv swapCardGroupColumnBottom";  
  div.appendChild(divBot);

  const butCancel = document.createElement("button");
  butCancel.innerHTML = "Cancel";
  butCancel.disabled = swapState == "Claimed" || swapState == "Cancelled" || owner != signerAddress;
  butCancel.onclick = cancelSwapButtonClicked; 
  butCancel.id = `cancelSwapButton${side}`;
  divBot.appendChild(butCancel);
 
  const butAction = document.createElement("button");
  butAction.innerHTML = "Deposit";
  butAction.id = `actionSwapButton${side}`;
  butAction.onclick = swapButtonClicked;
  divBot.appendChild(butAction);
 
  switch(state){
    case 0:
      butAction.innerHTML = "Deposit";
      break;
    case 1:
      butAction.innerHTML = "Claim";
      butAction.disabled = swapState == "Pending" || swapState == "Cancelled";
      break;
    case 2:
      butAction.innerHTML = "Claimed";
      butAction.disabled = true;
  }
  butAction.disabled |= owner != signerAddress || swapState == "Cancelled" || swapState == "Claimed";
  return div;
}

async function createTokenElement(contract, tokenId){
  const div = document.createElement("div");
  div.className = "swapCardToken";

  const nftContract = new ethers.Contract(contract, nftAbi, signer);
  const tokenURI = await nftContract.tokenURI(tokenId);
  let json = await (await fetch(tokenURI)).json();
 
  const img = document.createElement("img");
  img.src = json.image; 
  const title = document.createElement("p");
  title.className = "swapCardTokenText";
  title.innerHTML = json.name;
  const id = document.createElement("p");
  id.className = "swapCardTokenText";
  id.innerHTML = `Token Id: ${tokenId}`; 
 
  const cont = document.createElement("a");
  cont.className = "swapCardTokenText";
  cont.innerHTML = contract;
  cont.target="_blank";
  cont.href = `https:/${scanner}/address/${contract}`;

  div.appendChild(img);
  div.appendChild(title);
  div.appendChild(id);
  div.appendChild(cont);
  return div;
}

// ##########################
 

function getState(swap){ 
    if(swap.StateA == 2 && swap.StateB == 2){
        return 2;
    }
    if(swap.StateA == 0 || swap.StateB == 0){
        return 0;
    }
    if(swap.StateA == 1 && swap.StateB == 1){
        return 1;
    }
    if(swap.StateA == 3 || swap.StateB == 3){
        return 3;
    }
    return 0; 
}
function translateState(stateIndex){
    switch(stateIndex){
        case 0:
            return "Pending";
        case 1:
            return "Deposited";
        case 2:
            return "Claimed";
        case 3:
            return "Cancelled";
        default:
            return "Pending";
    }
}

function translateStateWithEmoji(stateIndex){
    switch(stateIndex){
        case 0:
            return "Pending <span class='emoji'>📌</span>";
        case 1:
            return "Deposited <span class='emoji'>📫</span>";
        case 2:
            return "Claimed <span class='emoji'>🤝</span>";
        case 3:
            return "Cancelled <span class='emoji'>❌</span>";
        default:
            return translateStateWithEmoji(0);
    }
}

function copyText(id){
  const text = document.getElementById(id); 
  navigator.clipboard.writeText(text.innerHTML);
}

function alertError(error){
  if(error.reason){
    alert(error.reason);
  }else if(error.message){
    alert(error.message);
  }
   
  if(typeof error === 'object'){
    console.error({error});
  }else{
    console.error(error);
  }
 
}