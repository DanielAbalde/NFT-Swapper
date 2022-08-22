<h3 align="center">NFT SWAPPER (BETA)</h3> 
<p align="center">Peer to peer exchange of multiple NFTs on EVM chains</p>
 


Instead of listing your NFTs and waiting for an offer, this exchanger registers an agreement to swap specific tokens for other specific tokens. The registry creator chooses who and what to exchange, and the swap takes place when the second party accepts the deal. It is generic or extensible to other types of tokens, both fungible and non-fungible.

The main contract is the [NFTSwapper](./contracts/NFTSwapper.sol), where swaps are stored and handled. For each type of token, there is a specific contract that follows the [ISwapperHandler](./contracts/ISwapperHandler.sol) interface. These are responsible for the transfer, so these are the addresses to be approved as operators.

### Contract Addresses 🔑

| Chain	| Swapper | ERC721 | ERC1155 | LSP7 | LSP8 | 
|:-------:|:-------:|:-------:|:-------:|:-------:|:-------:|
| Mumbai	| [0xa211...c8c](https://mumbai.polygonscan.com/address/0xa2119757427C842670aDba41FaeF914fcC9eDc8c#code) | [0xE406...825](https://mumbai.polygonscan.com/address/0xE40692FFdCAf5703EdB523863E86fa1e9F8D2825#code) | [0x8c5d...a97](https://mumbai.polygonscan.com/address/0x8c5d6396489fE528B227D62fA3483bb346824a97#code) | [0x7eCF...73C](https://mumbai.polygonscan.com/address/0x7eCFb1D1BB649F8C7bBf099B15f68D7Cb662a73C#code) | [0xC243...04D](https://mumbai.polygonscan.com/address/0xC2439e3ED3Be3f8723C84eAb8aD8DCAb9243804D#code) |


### Steps 🗺️
* Create a new swap agreement by registering the bidder, tendered, NFT contract addresses, the token IDs and amounts.
* Owners of NFTs must approve as operator the Swapper handlers addresses on the NFT contracts. 
* One tendered can claim the swap and both receive the other's NFTs.

### Contribute ☕
* Issues and Pull Request on Github are welcome.
* Let me know if you deploy the contracts on a different EVM blockchain.
* Buy me a coffee at 0x4443049b49Caf8Eb4E9235aA1Efe38FcFA0055a1
* Share it on social media!

### Contact ✉️
 * Twitter: [@DGANFT](https://twitter.com/DGANFT)
 * Discord: [DaniGA#9856](https://discord.com/invite/H4WMdnz5nw)

### License ♻️
  * [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)