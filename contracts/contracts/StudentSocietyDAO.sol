// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MyERC20.sol";
import "./MyERC721.sol";

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
        bool TokenPaid; //是否支付提案通过后的奖励
        bool TokenRecieved;
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
    //NFT
    MyERC721 public UserNFT;


    constructor() {
        // maybe you need a constructor
        UserToken = new MyERC20("UserToken","UT");
        UserNFT = new MyERC721("UserNFT","UN");

    }
    //新建提案
    function addNewProposal(string calldata ProposalContent) public {
        require(UserToken.balanceOf(msg.sender) >= 1000, "You don't have enough token to initiate a proposal");//确认积分足够发起提案
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
            numDisagree:0,
            TokenPaid:false,
            TokenRecieved:false
        });

        _AllProposals.ProposalInfo[currentIndex] = NewProposal; // 添加一个提案
        _AllProposals.ProposalIndex.push(currentIndex); // 添加一个新id
        _AllProposals.ProposalCounter.increment(); //
    }

    function getAllProposalIndex() public view returns (uint[] memory) {
        return _AllProposals.ProposalIndex;
    }

    // 获取提案信息
    function getProposalInformation(uint index, uint256 nowTime) public view returns (address, string memory, uint256, uint256, uint,uint[2] memory,bool[2] memory) {
        uint  status = getProposalStatus(index,nowTime);
        Proposal storage tmpproposal = _AllProposals.ProposalInfo[index];
        address  proposer = tmpproposal.proposer ;  // 发起者
        string memory content = tmpproposal.content;   // 内容
        uint256 startTime = tmpproposal.startTime; // 开始时间
        uint256 endTime = tmpproposal.endTime;   // 截止时间
        uint[2] memory num = [tmpproposal.numAgree,tmpproposal.numDisagree];
        bool[2] memory Token = [tmpproposal.TokenPaid,tmpproposal.TokenRecieved];

        return (proposer, content, startTime, endTime, status,num,Token);
    }
    // 统计提案投票情况
    function getProposalStatus(uint proposalIndex, uint256 nowTime) public view returns (uint) {
        if (nowTime > _AllProposals.ProposalInfo[proposalIndex].endTime) {
            if (_AllProposals.ProposalInfo[proposalIndex].numAgree > _AllProposals.ProposalInfo[proposalIndex].numDisagree) {return 1;}
            else{return 2;}
        }
        else {return 0;}
    }

    // 提案通过奖励
    function getProposalReward(uint proposalIndex) public {
        _AllProposals.ProposalInfo[proposalIndex].TokenPaid = true;
        UserToken.transfer(msg.sender,(_AllProposals.ProposalInfo[proposalIndex].numDisagree+_AllProposals.ProposalInfo[proposalIndex].numAgree)*100 +1000 );
    }

    //投票
    function addNewVote(uint content, uint proposalIndex ) public {

        require(UserToken.balanceOf(msg.sender) >= 100, "You don't have enough token to vote");
        UserToken.transferFrom(msg.sender, address(this), 100); // 委托转账给本合约

        if (content == 1){_AllProposals.ProposalInfo[proposalIndex].numAgree++;}
        else if (content == 2){_AllProposals.ProposalInfo[proposalIndex].numDisagree++;}

    }
}
