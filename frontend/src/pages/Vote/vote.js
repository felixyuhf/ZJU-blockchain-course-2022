import React, {useState} from 'react'
import Grid from '@mui/material/Grid';
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchBar from "../../components/common/SearchBar/SearchBar";
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import CommonButton from '../../components/common/CommonButton/CommonButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GridWrapper from '../../components/common/GridWrapper/GridWrapper';
import {cardHeaderStyles} from './styles';
import Input from "@mui/material/Input";
import {modalStyles} from "../../components/common/BasicModal/styles";
import {TextField} from "@mui/material";
import {useForm} from 'react-hook-form';
import NewVoteModal from "../../components/Modals/NewVoteModal";
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup'


const Vote = () => {
    const [open, setOpen] = useState(false)
    const [votes, setVotes] = useState(false)

    const getHeader = () => {
        const handleChange = (value) => {
            console.log(value);
        };

        const newVote = () => {
            setOpen(true)
        };

        return (
            <Box sx={cardHeaderStyles.wrapper}>
                <SearchBar
                    placeholder="搜索提案"
                    onChange={(event) => handleChange(event.target.value)}
                    searchBarWidth='720px'
                />
                <Box>
                    <CommonButton
                        variant="contained"
                        onClick={newVote}
                        size="large"
                        sx={cardHeaderStyles.newVoteButton}
                    >
                        新建提案
                    </CommonButton>

                </Box>
            </Box>
        )
    };

    const getContent = () => (
        <Typography
            align="center"
            sx={{margin: '40px 16px', color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.3rem'}}
        >
            暂无提案
        </Typography>
    );


    const addNewVote =(data)=>{
        console.log(data)
    };

    return (
        <GridWrapper>
            <BasicCard
                header={getHeader()}
                content={getContent()}
            />
            {/*<BasicModal*/}
            {/*    open={open}*/}
            {/*    onClose={() => setOpen(false)}*/}
            {/*    title="新建提案"*/}
            {/*    content={getInput()}*/}
            {/*    onSubmit={handleSubmit()}*/}

            {/*/>*/}
            <NewVoteModal
                open={open}
                onClose={() => setOpen(false)}
                addNewVote={addNewVote}
            />
        </GridWrapper>
    )

}

export default Vote
