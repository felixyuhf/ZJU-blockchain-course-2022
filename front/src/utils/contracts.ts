import Addresses from './contract-addresses.json'


const Web3 = require('web3');

// @ts-ignore
// 创建web3实例
// 可以阅读获取更多信息https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
let web3 = new Web3(window.web3.currentProvider)

// TODO 修改地址为部署的合约地址！！

// const lotteryAddress = Addresses.lottery
// const lotteryABI = Lottery.abi
// const myERC20Address = Addresses.myERC20
// const myERC20ABI = MyERC20.abi

// 获取合约实例
// const lotteryContract = new web3.eth.Contract(lotteryABI, lotteryAddress);
// const myERC20Contract = new web3.eth.Contract(myERC20ABI, myERC20Address);

// 导出web3实例和其它部署的合约
//export {web3, lotteryContract, myERC20Contract}

export {web3}