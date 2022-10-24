import React, { useState, useEffect } from 'react'
import BasicModal from "../common/BasicModal/BasicModal";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'

const defaultInputValues = {
    VoteContent: '',
};

const NewVoteModal = ({ open, onClose, addNewVote }) => {
    const [values, setValues] = useState(defaultInputValues);

    const modalStyles = {
        inputFields: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginBottom: '15px',
            '.MuiFormControl-root': {
                marginBottom: '20px',
            },
        },
    };


    const validationSchema = Yup.object().shape({
        VoteContent: Yup.string()
            .required('提案内容不能为空')//无内容时报错
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const addVote = (data) => {
        addNewVote(data);
        //console.log(data)
    };

    const handleChange = (value) => {
        setValues(value)
    };

    //关闭之后重置输入
    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open])

    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            <TextField
                placeholder="内容"
                name="VoteContent"
                label="内容"
                required
                {...register('VoteContent')}//输出标题
                error={errors.VoteContent ? true : false}//红框
                helperText={errors.VoteContent?.message}//错误提示
                value={values.VoteContent}
                onChange={(event) => handleChange({ ...values, VoteContent: event.target.value })}
            />

        </Box>
    );

    return (
        <BasicModal
            open={open}
            onClose={onClose}
            title="新建提案"
            content={getContent()}
            onSubmit={handleSubmit(addVote)}
        />

    )
}

export default NewVoteModal