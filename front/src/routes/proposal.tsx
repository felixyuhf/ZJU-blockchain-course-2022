import {Form} from "react-router-dom";
import {AudioOutlined} from '@ant-design/icons';
import {Input, Space} from 'antd';
import React, {useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup'
import {Button, Modal} from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import {FileSearchOutlined} from "@ant-design/icons";
import BasicModal from "../components/common/BasicModal/BasicModal";

const {TextArea} = Input;

const defaultInputValues = {
    ProposalContent: '',
};

const onSearch = (value: string) => console.log(value);

export default function Proposal() {


    const handleSearch = (value) => {
        //filterData(value);
        console.log(value)
    };

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


    const [proposals, setProposals] = useState([] as string[]);

    const addProposal = (data) => {
        console.log(data);
        proposals.push({...data});
        setOpen(false);
    };



    return (
        <div id="proposal">
            <div>

            </div>

            <div>
                <h1>
                    <>
                        提案广场
                    </>

                </h1>

                <div>
                    <Input.Group compact>
                        <Input
                            style={{width: '80%'}}
                            size="large"
                            placeholder="搜索提案"
                            prefix={<FileSearchOutlined/>}
                            onChange={(event) => handleSearch(event.target.value)}
                            allowClear
                        />
                        <Button
                            size="large"
                            type="primary"
                            onClick={newProposal}
                        >
                            新建提案
                        </Button>
                    </Input.Group>
                    <Modal
                        open={open}
                        onCancel={handleCancel}

                        //onOk={handleSubmit((data)=>console.log(data))}
                        //onOk={handleSubmit}
                        onOk={(event)=>console.log(event)}
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


                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !window.confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({proposal}) {
    // yes, this is a `let` for later
    let favorite = proposal.favorite;
    return (
        <Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </Form>
    );
}