// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {

    mapping(address => bool) claimedTokenUserList;//标志位记录用户是否领取过通证积分

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {

    }

    //用户领取初始通证积分
    function getIniToken() external {
        require(claimedTokenUserList[msg.sender] == false, "You have already received the token");
        _mint(msg.sender, 10000); //给msg.sender发10000钱
        claimedTokenUserList[msg.sender] = true;

    }

}