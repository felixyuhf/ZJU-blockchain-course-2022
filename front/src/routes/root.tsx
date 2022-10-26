import {Outlet,Link} from "react-router-dom";
import {useEffect, useState} from 'react';
import {web3} from "../utils/contracts";
import { Button } from 'antd';

import {
    UserOutlined,
    UserAddOutlined,
} from '@ant-design/icons';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

export default function Root() {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [playAmount, setPlayAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [playerNumber, setPlayerNumber] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    //第一个连接账户为accounts0
                    setAccount(accounts[0])
                }
            }
        }

        initCheckAccounts()
    }, [])

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }

    }



    return (
        <>
            <div id="sidebar">
                {/*<h1>React Router Contacts</h1>*/}

                <div className='accountName'>
                    <Button
                        shape="circle"
                        icon={<UserAddOutlined />}
                        onClick={onClickConnectWallet}
                    />
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>



                </div>

                <nav>
                    <ul>
                        <li>
                            <Link to={``}>首页</Link>
                        </li>
                        <li>
                            <Link to={`proposal`}>提案广场</Link>
                        </li>
                        <li>
                            <Link to={`nft`}>我的NFT</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>


        </>
    );
}