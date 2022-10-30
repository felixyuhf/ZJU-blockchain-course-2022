// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyERC721 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    struct UserNFT{

        uint numPassedProposal;
        bool getNFT;//是否已领取
        uint NFTId;
        string NFTURI;
    }
    struct AllUserNFT{
        mapping(address=>UserNFT[]) UserNFTInfo;
    }
    AllUserNFT public _AllUserNFT;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function awardItem(address player, string memory tokenURI) public returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();

        _mint(player, newItemId);//发币
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}