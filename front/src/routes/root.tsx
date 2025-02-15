import React, {useEffect, useState} from 'react';
import {web3, StudentSocietyDAOContract, MyERC20Contract, MyERC721Contract} from "../utils/contracts";
import {Layout, Button, Tooltip, Col, Row, Divider, Anchor, Typography, Card, Input, Modal, message, Badge} from 'antd';

import './root.css'
import {
    UserOutlined,
    UserAddOutlined,
    DollarCircleOutlined,
    SmileOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ReconciliationOutlined,
    StarOutlined
} from '@ant-design/icons';
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import moment from 'moment';


const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;

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
        if (MyERC20Contract && MyERC721Contract) {
            try {
                await MyERC20Contract.methods.getIniToken().send({from: account})
                await MyERC721Contract.methods.InitUserNFT().call({from: account})
                getAllUser()
                message.success('成功领取首次通证积分')
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
        numPassedProposal: 0,
        getNFT: false,
        NFTId: 0,
        NFTURI: "None"
    })
    //获取用户信息
    const getAllUser = async () => {
        if (StudentSocietyDAOContract && MyERC20Contract && MyERC721Contract) {
            try {
                const _Balance = await MyERC20Contract.methods.balanceOf(account).call({from: account})
                const _UserNFT = await MyERC721Contract.methods.getUserNFT().call({from: account})
                //console.log(_UserNFT)
                const _userInfo = {
                    balance: +_Balance,
                    numPassedProposal: _UserNFT[0],
                    getNFT: _UserNFT[1],
                    NFTId: _UserNFT[2],
                    NFTURI: _UserNFT[3]
                }
                setUserInfo(_userInfo)
                console.log(_userInfo)
                if (_userInfo.numPassedProposal >= 3 && _userInfo.getNFT == false) {
                    message.info('已成功提案并通过3次，可领取NFT奖励')
                }

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
        StatusProposal: 0,
        numAgree: 0,
        numDisagree: 0,
        TokenPaid: false,
        TokenRecieved: false
    }])
    //获取提案信息
    const getAllProposalInfo = async () => {
        if (StudentSocietyDAOContract) {
            try {
                const _proposalIndex = await StudentSocietyDAOContract.methods.getAllProposalIndex().call({from: account})
                const __proposalIndex = _proposalIndex.map((item: string) => +item)
                const _proposalInfo = await Promise.all(__proposalIndex.map(async (index: number) => {
                    try {
                        const _proposalInformation = await StudentSocietyDAOContract.methods.getProposalInformation(index, Date.parse(new Date().toString()) / 1000).call({from: account})
                        //console.log(_proposalInformation)
                        return {
                            index: index,
                            content: _proposalInformation[1],
                            proposer: _proposalInformation[0],
                            startTime: _proposalInformation[2],
                            endTime: _proposalInformation[3],
                            StatusProposal: _proposalInformation[4],
                            numAgree: _proposalInformation[5][0],
                            numDisagree: _proposalInformation[5][1],
                            TokenPaid: _proposalInformation[6][0],
                            TokenRecieved: _proposalInformation[6][1]
                        }

                    } catch (error: any) {
                        alert(error)
                    }
                }))
                //console.log(_proposalInfo)
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
                message.success('成功新建提案')
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


    // 提案通过奖励
    const getProposalReward = async (proposalIndex) => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (StudentSocietyDAOContract && MyERC20Contract) {
            try {
                await StudentSocietyDAOContract.methods.getProposalReward(proposalIndex).send({from: account})
                console.log(userInfo.numPassedProposal)
                await MyERC721Contract.methods.addNumPassedProposal().send({from: account})

                getAllUser()
                getAllProposalInfo()
                message.success('成功领取提案通过奖励')
            } catch (error: any) {
                alert(error)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    // 领取NFT奖励
    const getNFT = async () => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (StudentSocietyDAOContract && MyERC721Contract) {
            try {
                await MyERC721Contract.methods.awardItem(account, "提案能手").send({from: account})
                getAllUser()
                getAllProposalInfo()
                alert('You have successfully received the NFT after your proposal has been passed three times')
            } catch (error: any) {
                alert(error)
            }
        } else {
            alert('Contract not exists.')
        }
    }


    // 投票
    const handleVote = async (content, proposalIndex) => {
        if (account === '') {
            alert('You have not connected wallet yet.')
            return
        }
        if (StudentSocietyDAOContract && MyERC20Contract) {
            try {
                await MyERC20Contract.methods.approve(StudentSocietyDAOContract.options.address, 100).send({from: account})
                await StudentSocietyDAOContract.methods.addNewVote(content, proposalIndex).send({from: account})
                getAllUser()
                getAllProposalInfo()
                message.success('成功完成投票')
            } catch (error: any) {
                alert(error)
            }
        } else {
            alert('Contract not exists.')
        }
    }

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
                    <Col span={4}>
                        <div style={{color: 'white'}}>
                            当前账户通证积分：{account === '' ? '无用户连接' : userInfo.balance}
                        </div>
                    </Col>
                    <Col span={1}>
                        <Tooltip title="领取NFT奖励">
                            <Button
                                shape="circle"
                                icon={<SmileOutlined/>}
                                disabled={userInfo.numPassedProposal >= 3 ? (userInfo.getNFT == false ? false : true) : true}
                                onClick={() => getNFT()}
                            />
                        </Tooltip>

                    </Col>
                    <Col span={4}>
                        <div style={{color: 'white'}}>
                            {userInfo.numPassedProposal >= 3 ? (userInfo.getNFT == false ? '可领取NFT奖励' : '已领取NFT奖励') : 'NFT待添加'}
                            {userInfo.numPassedProposal >= 3 ? (userInfo.getNFT == false ? '' :
                                <StarOutlined spin={true}/>) : ''}

                        </div>
                    </Col>
                    <Col span={2}>
                        <div>
                            <Button
                                size="large"
                                type="primary"
                                onClick={newProposal}
                            >
                                新建提案
                            </Button>
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

                        </div>
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Layout>
                    <Header style={{marginTop: 64, backgroundColor: '#F0F2F5'}}>

                        <Title level={3}>提案广场</Title>

                    </Header>
                    <Content style={{padding: '0 50px', overflow: 'scroll'}}>
                        <div>
                            {
                                (proposalInfo.length && account != '')?
                                    proposalInfo.map((itemproposalInfo) => (
                                        <div style={{borderColor: "blue"}}>
                                            {itemproposalInfo.proposer == account ?
                                                <Badge.Ribbon
                                                    text={itemproposalInfo.StatusProposal == 0 ? "正在投票中" : (itemproposalInfo.StatusProposal == 1 ? "提案已通过" : "提案未通过")}
                                                    color={itemproposalInfo.StatusProposal == 0 ? "blue" : (itemproposalInfo.StatusProposal == 1 ? "green" : "red")}
                                                >
                                                    <Card hoverable={true} style={{borderColor: "hwb(205 6% 9%)"}}>
                                                        <Row>
                                                            <Col flex="auto">
                                                                <Row>
                                                                    <Col flex="auto">
                                                                        <ReconciliationOutlined/>
                                                                        {itemproposalInfo.content}
                                                                        <p></p>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col flex="auto" style={{color: "hwb(205 6% 9%)"}}>
                                                                        <UserOutlined/>
                                                                        我的提案
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col
                                                                flex="120px">{moment(itemproposalInfo.startTime * 1000).format("YYYY-MM-DD HH:mm:ss")}</Col>
                                                            <Col
                                                                flex="120px">{moment(itemproposalInfo.endTime * 1000).format("YYYY-MM-DD HH:mm:ss")}</Col>
                                                            <Col flex="115px">
                                                                <Row>
                                                                    <Col flex="30px">
                                                                        <Tooltip
                                                                            title={Date.parse(new Date().toString()) / 1000 < itemproposalInfo.endTime ? "正在投票中" : (itemproposalInfo.TokenPaid == true ? "奖励已领取" : "领取奖励")}>
                                                                            <Button
                                                                                shape="circle"
                                                                                icon={<DollarCircleOutlined/>}
                                                                                disabled={itemproposalInfo.TokenPaid == true ? true : (itemproposalInfo.StatusProposal == 1 ? false : true)}
                                                                                onClick={() => getProposalReward(itemproposalInfo.index)}
                                                                            />
                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col flex="70px">
                                                                        <Row>
                                                                            <span
                                                                                style={{color: 'green'}}>{itemproposalInfo.numAgree}人已赞成</span>
                                                                        </Row>
                                                                        <Row>
                                                                            <span
                                                                                style={{color: 'red'}}>{itemproposalInfo.numDisagree}人已拒绝</span>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Badge.Ribbon>

                                                :

                                                <Badge.Ribbon
                                                    text={itemproposalInfo.StatusProposal == 0 ? "正在投票中" : (itemproposalInfo.StatusProposal == 1 ? "提案已通过" : "提案未通过")}
                                                    color={itemproposalInfo.StatusProposal == 0 ? "blue" : (itemproposalInfo.StatusProposal == 1 ? "green" : "red")}
                                                >
                                                    <Card hoverable={true}>
                                                        <Row>
                                                            <Col flex="auto">
                                                                <Row>
                                                                    <Col flex="auto">
                                                                        <ReconciliationOutlined/>
                                                                        {itemproposalInfo.content}
                                                                        <p></p>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col flex="auto">
                                                                        <UserOutlined/>
                                                                        {itemproposalInfo.proposer}
                                                                    </Col>
                                                                </Row>

                                                            </Col>
                                                            <Col
                                                                flex="120px">{moment(itemproposalInfo.startTime * 1000).format("YYYY-MM-DD HH:mm:ss")}</Col>
                                                            <Col
                                                                flex="120px">{moment(itemproposalInfo.endTime * 1000).format("YYYY-MM-DD HH:mm:ss")}</Col>
                                                            <Col flex="115px">
                                                                <Row>
                                                                    <Col flex="30px">
                                                                        <Tooltip
                                                                            title={Date.parse(new Date().toString()) / 1000 < itemproposalInfo.endTime ? "赞成提案" : "投票已截止"}>
                                                                            <Button
                                                                                shape="circle"
                                                                                icon={<CheckCircleOutlined/>}
                                                                                disabled={Date.parse(new Date().toString()) / 1000 < itemproposalInfo.endTime ? false : true}
                                                                                onClick={() => handleVote(1, itemproposalInfo.index)}
                                                                            />

                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col flex="70px">
                                                                        {itemproposalInfo.numAgree}人已赞成
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col flex="30px">
                                                                        <Tooltip
                                                                            title={Date.parse(new Date().toString()) / 1000 < itemproposalInfo.endTime ? "拒绝提案" : "投票已截止"}>
                                                                            <Button
                                                                                shape="circle"
                                                                                icon={<CloseCircleOutlined/>}
                                                                                disabled={Date.parse(new Date().toString()) / 1000 < itemproposalInfo.endTime ? false : true}
                                                                                onClick={() => handleVote(2, itemproposalInfo.index)}
                                                                            />

                                                                        </Tooltip>
                                                                    </Col>
                                                                    <Col flex="70px">
                                                                        {itemproposalInfo.numDisagree}人已拒绝
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </Badge.Ribbon>
                                            }
                                            <p></p>
                                        </div>
                                    ))
                                    :
                                    <Card hoverable={true}>
                                        <Typography
                                            style={{margin: '40px 16px', color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.3rem',textAlign: 'center'}}
                                        >
                                            暂无提案
                                        </Typography>
                                    </Card>



                            }
                        </div>


                    </Content>
                    <Footer style={{textAlign: 'center'}}>StudentSocietyDAO Created by ZJU-YHF </Footer>
                </Layout>
            </Layout>
        </Layout>


    );
}