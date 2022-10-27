// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MyERC20.sol";

contract StudentSocietyDAO {
    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    //提案
    struct Proposal {
        uint index;      // 编号
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

    //提案合集
    using Counters for Counters.Counter;
    struct AllProposals {
        mapping(uint=>Proposal) ProposalInfo;
        uint[] ProposalIndex;
        Counters.Counter ProposalCounter;
    }
    AllProposals private _AllProposals; // 存储所有提案的信息


    mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal

    //通证积分
    MyERC20 public UserToken;



    constructor() {
        // maybe you need a constructor
        UserToken = new MyERC20("UserToken","UT");

    }
    //新建提案
    function addNewProposal(string calldata ProposalContent) public {
        require(UserToken.balanceOf(msg.sender) >= 1000, "You don't have enough token to initiate a proposal");//确认积分足够发起提案
        //require(TP.allowance(msg.sender, address(this)) >= _proposals.tpConsumedByProposal, "DSOMW don't have allowance over your TP. Please authorize DSOMW.");
        UserToken.transferFrom(msg.sender, address(this), 1000); //委托转账给本合约

        uint currentIndex = _AllProposals.ProposalCounter.current(); // 获取当前提案计数

        Proposal memory NewProposal = Proposal({
            index:currentIndex,
            proposer:msg.sender,
            content:ProposalContent,
            startTime:block.timestamp,
            endTime:block.timestamp+7*24*60*60,
            StatusProposal:Status.isVoting});

        _AllProposals.ProposalInfo[currentIndex] = NewProposal; // 添加一个提案
        _AllProposals.ProposalIndex.push(currentIndex); // 添加一个新id
        _AllProposals.ProposalCounter.increment(); //
    }

    function getAllProposalIndex() public view returns (uint[] memory) {
        return _AllProposals.ProposalIndex;
    }

    // 获取提案信息
    function getProposalInformation(uint index) public view returns (address, string memory, uint256, uint256) {

        address proposer = _AllProposals.ProposalInfo[index].proposer ;  // 发起者
        string memory content = _AllProposals.ProposalInfo[index].content;   // 内容
        uint256 startTime = _AllProposals.ProposalInfo[index].startTime; // 开始时间
        uint256 endTime = _AllProposals.ProposalInfo[index].endTime;   // 截止时间

        return (proposer, content, startTime, endTime);
    }

}
