// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MyERC20.sol";

contract StudentSocietyDAO {
    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    //提案
    struct Proposal {
        uint32 index;      // 编号
        address proposer;  // 发起者
        string content;   // 内容
        uint256 startTime; // 开始时间
        uint256 endTime;   // 截止时间
        Status StatusProposal; //提案状态
    }
    enum Status{
        isVoting,
        isPassed,
        isUnpassed
    }



    mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal

    //通证积分
    MyERC20 public UserToken;



    constructor() {
        // maybe you need a constructor
        UserToken = new MyERC20("UserToken","UT");
    }

}
