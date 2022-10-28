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
        uint StatusProposal; //提案状态：0进行中，1通过，2拒绝
        uint numAgree;//同意票数
        uint numDisagree;//拒绝票数
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

    //投票
    struct Vote {
        uint proposalIndex; //投票的提案编号
        uint content; //投票内容 0未投票，1同意，2拒绝
        address voterAddress; // 投票人地址
    }
    // 投票合集
    struct AllVotes {
        mapping(address=>mapping(uint=>Vote[])) VoteInfo;
        address[] AllvoterAddress; // 存储所有用户的地址
    }
    AllVotes private _AllVotes; // 存储所有投票的信息


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
            endTime:block.timestamp+2*60,
            StatusProposal:0,
            numAgree:0,
            numDisagree:0
        });

        _AllProposals.ProposalInfo[currentIndex] = NewProposal; // 添加一个提案
        _AllProposals.ProposalIndex.push(currentIndex); // 添加一个新id
        _AllProposals.ProposalCounter.increment(); //
    }

    function getAllProposalIndex() public view returns (uint[] memory) {
        return _AllProposals.ProposalIndex;
    }

    // 获取提案信息
    function getProposalInformation(uint index, uint256 nowTime) public view returns (address, string memory, uint256, uint256, uint,uint,uint) {
        uint  status = getProposalStatus(index,nowTime);
        Proposal storage tmpproposal = _AllProposals.ProposalInfo[index];

        address proposer = tmpproposal.proposer ;  // 发起者
        string memory content = tmpproposal.content;   // 内容
        uint256 startTime = tmpproposal.startTime; // 开始时间
        uint256 endTime = tmpproposal.endTime;   // 截止时间

        uint  numAgree = tmpproposal.numAgree;
        uint  numDisagree = tmpproposal.numDisagree;



        return (proposer, content, startTime, endTime, status,numAgree,numDisagree);
    }
    // 统计提案投票情况
    function getProposalStatus(uint proposalIndex, uint256 nowTime) public view returns (uint) {
        if (nowTime > _AllProposals.ProposalInfo[proposalIndex].endTime) {
            if (_AllProposals.ProposalInfo[proposalIndex].numAgree > _AllProposals.ProposalInfo[proposalIndex].numDisagree) {return 1;}
            else{return 2;}
        }
        else {return 0;}
    }

    //投票
    function addNewVote(uint content, uint proposalIndex ) public {

        require(UserToken.balanceOf(msg.sender) >= 100, "You don't have enough token to vote");
        UserToken.transferFrom(msg.sender, address(this), 100); // 委托转账给本合约

        if (content == 1){_AllProposals.ProposalInfo[proposalIndex].numAgree++;}
        else if (content == 2){_AllProposals.ProposalInfo[proposalIndex].numDisagree++;}

    }
}
