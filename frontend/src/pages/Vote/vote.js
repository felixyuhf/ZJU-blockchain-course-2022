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
    const [open, setOpen] = useState(false);
    const [votes, setVotes] = useState([]);
    const [searchResults, setsearchResults] = useState(votes);

    const getHeader = () => {
        const handleSearch = (value) => {
            filterData(value);
        };

        const filterData = (value) => {
            const lowercasedValue = value.toLowerCase().trim();
            if (lowercasedValue === '') setVotes(searchResults);
            else {
                const filteredData = searchResults.filter((item) => {
                    return Object.keys(item).some((key) =>
                        item[key].toString().toLowerCase().includes(lowercasedValue)
                    );
                });
                setVotes(filteredData)
            }
            ;
        };

        const newVote = () => {
            setOpen(true)
        };

        return (
            <Box sx={cardHeaderStyles.wrapper}>
                <SearchBar
                    placeholder="搜索提案"
                    onChange={(event) => handleSearch(event.target.value)}
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

    const addNewVote = (data) => {
        console.log(data);
        votes.push({...data});
        setOpen(false);
    };

    const getContent = () => (
        <>
            {
                votes.length ?
                    votes.map((vote) => (
                        <Box sx={{marginBottom: '20px'}}>
                            <Box sx={{marginBottom: '5px'}}>
                                提案内容：{vote.VoteContent}
                            </Box>

                            <CommonButton
                                variant="contained"
                                //onClick={newVote}
                                size="small"
                                sx={cardHeaderStyles.newVoteButton}
                            >
                                赞成
                            </CommonButton>

                            <CommonButton
                                variant="outlined"
                                //onClick={newVote}
                                size="small"
                                sx={cardHeaderStyles.newVoteButton}
                            >
                                反对
                            </CommonButton>

                        </Box>
                    ))
                    :
                    <Typography
                        align="center"
                        sx={{margin: '40px 16px', color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.3rem'}}
                    >
                        暂无提案
                    </Typography>
            }
        </>

    );


    return (
        <GridWrapper>
            <BasicCard
                header={getHeader()}
                content={getContent()}
            />
            <NewVoteModal
                open={open}
                onClose={() => setOpen(false)}
                addNewVote={addNewVote}
            />
        </GridWrapper>
    )

}

export default Vote
