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
import BasicModal from "../../components/common/BasicModal/BasicModal";


const Vote = () => {
    const [open, setOpen] = useState(false);

    const getHeader = () => {
        const handleChange = (value) => {
            console.log(value);
        };

        const newVote = () => {
            setOpen(true);
            console.log('click')
        };

        return (
            <Box sx={cardHeaderStyles.wrapper}>
                <SearchBar
                    placeholder="搜索我的提案"
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

                    <IconButton>
                        <RefreshIcon/>
                    </IconButton>
                </Box>
            </Box>
        )
    };

    const getContent = () => (
        <Typography
            align="center"
            sx={{margin: '40px 16px', color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.3rem'}}
        >
            当前没有提案
        </Typography>
    );

    return (
        <GridWrapper>
            <BasicCard
                header={getHeader()}
                content={getContent()}
            />
            <BasicModal
                open={open}
            />
        </GridWrapper>
    )

    // const getSearchBar = () => {
    //     const handleChange = (value) => {
    //         console.log(value);
    //     };
    //     return (
    //         <SearchBar
    //             placeholder="搜索我的提案"
    //             onChange={(event) => handleChange(event.target.value)}
    //         />
    //     )
    // }
    //
    // return (
    //     <Grid item xs={8}>
    //         <BasicCard Header={getSearchBar()}/>
    //     </Grid>
    // )

}

export default Vote
