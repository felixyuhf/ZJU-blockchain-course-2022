import {Outlet} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {web3, StudentSocietyDAOContract, MyERC20Contract} from "../utils/contracts";
import {Layout, Button, Tooltip, Col, Row, Divider, Anchor, Typography, Card, Input, Modal, Table} from 'antd';

import './root.css'

import {
    UserOutlined,
    UserAddOutlined,
    DollarCircleOutlined,
    SmileOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined ,
    ReconciliationOutlined,
} from '@ant-design/icons';
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import moment from 'moment';

const {Link} = Anchor;
const {Header, Content, Footer, Sider} = Layout;

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

const {TextArea} = Input;

const defaultInputValues = {
    ProposalContent: '',
};

export default function Root() {

    const [account, setAccount] = useState('')

    const [accountBalance, setAccountBalance] = useState(0)
    const [playAmount, setPlayAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [playerNumber, setPlayerNumber] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')

    //账户相关
    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if (accounts && accounts.length) {
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
    //首次领取通证积分
    const onClickGetIniToken = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (MyERC20Contract) {
            try {
                await MyERC20Contract.methods.getIniToken().send({from: account})
                getAllUser()
                alert('You have claimed Token.')
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }

    }

    //用户信息
    const [userInfo, setUserInfo] = useState({
        balance: 0,
    })
    //获取用户信息
    const getAllUser = async () => {
        if (StudentSocietyDAOContract && MyERC20Contract) {
            try {
                const _userBalance = await MyERC20Contract.methods.balanceOf(account).call({from: account})


                const _userInfo = {balance: +_userBalance}
                setUserInfo(_userInfo)

            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }

    }
    useEffect(() => {
        if (account !== '') {
            getAllUser()
        }
    }, [account]);


    //提案相关
    const [proposalInfo, setProposalInfo] = useState([{
        index: 0,
        content: "",
        proposer: "",
        startTime: 0,
        endTime: 0,
    }])
    //获取提案信息
    const getAllProposalInfo = async () => {
        if (StudentSocietyDAOContract) {
            try {
                const _proposalIndex = await StudentSocietyDAOContract.methods.getAllProposalIndex().call({from: account})
                const __proposalIndex = _proposalIndex.map((item: string) => +item)
                const _proposalInfo = await Promise.all(__proposalIndex.map(async (index: number) => {
                    try {
                        const _proposalInformation = await StudentSocietyDAOContract.methods.getProposalInformation(index).call({from: account})
                        return {
                            index: index,
                            content: _proposalInformation[1],
                            proposer: _proposalInformation[0],
                            startTime: _proposalInformation[2],
                            endTime: _proposalInformation[3],
                        }

                    } catch (error: any) {
                        alert(error)
                    }
                }))
                console.log(_proposalInfo)
                setProposalInfo(_proposalInfo)
            } catch (error: any) {
                alert(error)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    useEffect(() => {
        if (account !== '') {
            getAllProposalInfo()
        }
    }, [account])


    //新建提案
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState(defaultInputValues);
    const newProposal = () => {
        setOpen(true)
        //console.log("open newProposal")
    };
    const handleCancel = () => {
        setOpen(false)
    };
    const addNewProposal = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (StudentSocietyDAOContract && MyERC20Contract) {
            try {
                await MyERC20Contract.methods.approve(StudentSocietyDAOContract.options.address, 2000).send({from: account})
                await StudentSocietyDAOContract.methods.addNewProposal(values.ProposalContent).send({from: account})
                getAllUser()
                getAllProposalInfo()
                alert('You add a new proposal.')
            } catch (error: any) {
                alert(error)
            }
        } else {
            alert('Contract not exists.')
        }
    }
    const handleOK = () => {
        console.log(values.ProposalContent)
        setOpen(false)
        addNewProposal()
    };

    const handleChange = (value) => {
        setValues(value)
        console.log(value)
    };
    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open])//关闭之后重置输入


    const validationSchema = Yup.object().shape({
        ProposalContent: Yup.string()
            .required('提案内容不能为空')//无内容时报错
    });

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema)
    });


    return (
        <Layout>
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}>
                <Row>
                    <Col span={1}>
                        <Tooltip title="连接钱包">
                            <Button
                                shape="circle"
                                icon={<UserAddOutlined/>}
                                onClick={onClickConnectWallet}
                            />
                        </Tooltip>
                    </Col>
                    <Col span={11}>
                        <div style={{color: 'white'}}>
                            当前用户：{account === '' ? '无用户连接' : account}
                        </div>
                    </Col>
                    <Col span={1}>
                        <Tooltip title="领取通证积分">
                            <Button
                                shape="circle"
                                icon={<DollarCircleOutlined/>}
                                onClick={onClickGetIniToken}
                            />
                        </Tooltip>
                    </Col>
                    <Col span={5}>
                        <div style={{color: 'white'}}>
                            当前账户通证积分：{account === '' ? '无用户连接' : userInfo.balance}
                        </div>
                    </Col>
                    <Col span={1}>
                        <Button
                            shape="circle"
                            icon={<SmileOutlined/>}
                        />
                    </Col>
                    <Col span={5}>
                        <div style={{color: 'white'}}>

                            当前账户NFT：{account === '' ? '无用户连接' : '待添加'}
                        </div>
                    </Col>
                </Row>


            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background" style={{
                    marginTop: 64,
                    position: 'fixed',
                    backgroundColor: 'white',
                    overflow: 'auto',
                    height: '100vh'
                }}>
                    侧边栏
                </Sider>
                <Layout>
                    <Content style={{padding: '0 50px', marginTop: 64,marginLeft:200}}>
                        <Row>
                            <Col span={20}>
                                <Divider orientation="left">提案广场</Divider>
                            </Col>
                            <Col span={3}>
                                <Button
                                    size="large"
                                    type="primary"
                                    onClick={newProposal}
                                >
                                    新建提案
                                </Button>
                            </Col>
                            <Modal
                                open={open}
                                onCancel={handleCancel}
                                onOk={handleOK}
                                cancelText="取消"
                                okText="提交"
                                closable={false}
                                title="新建提案"
                            >
                                <TextArea
                                    rows={4} placeholder="提案内容"
                                    {...register('ProposalContent')}//输出标题
                                    value={values.ProposalContent}
                                    onChange={(event) => handleChange({...values, ProposalContent: event.target.value})}
                                />

                            </Modal>
                        </Row>
                        <div>
                            {
                                proposalInfo.length ?
                                    proposalInfo.map((itemproposalInfo) => (
                                        <div>
                                            <Card bordered={false}>
                                                <Row>
                                                    <Col flex="auto">
                                                        <ReconciliationOutlined />
                                                        {itemproposalInfo.content}
                                                    </Col>
                                                    <Col flex="20px">
                                                        <Tooltip title="赞成提案">
                                                            <Button
                                                                shape="circle"
                                                                icon={<CheckCircleOutlined />}
                                                                //onClick={onClickConnectWallet}
                                                            />
                                                        </Tooltip>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col flex="auto">
                                                        <UserOutlined />

                                                        {itemproposalInfo.proposer}
                                                    </Col>
                                                    <Col flex="120px">
                                                        {moment(itemproposalInfo.startTime*1000).format("YYYY-MM-DD HH:mm:ss")}
                                                    </Col>
                                                    <Col flex="120px">
                                                        {moment(itemproposalInfo.endTime*1000).format("YYYY-MM-DD HH:mm:ss")}
                                                    </Col>
                                                    <Col flex="20px">
                                                        <Tooltip title="拒绝提案">
                                                            <Button
                                                                shape="circle"
                                                                icon={<CloseCircleOutlined />}
                                                                //onClick={onClickConnectWallet}
                                                            />
                                                        </Tooltip>
                                                    </Col>
                                                </Row>


                                            </Card>
                                            <p></p>
                                        </div>


                                    ))
                                    : '暂无提案'

                            }
                        </div>


                    </Content>
                    <Footer style={{textAlign: 'center'}}>StudentSocietyDAO Created by ZJU-YHF </Footer>
                </Layout>
            </Layout>
        </Layout>


    );
}