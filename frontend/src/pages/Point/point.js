import React from 'react'
import Grid from '@mui/material/Grid';
import CommonButton from "../../components/common/CommonButton/CommonButton";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";

const Point = () => {
    const buttonStyles = {
        fontWeight:600,
        fontSize:'0.875rem',
        textTransform:'capitalize',
        borderRadius:2.5,

        '&.MuiButton-contained':{
            backgroundColor:'#009be5',
            '&:hover':{
                backgroundColor:'#006db3',
            },
        },
        '&.MuiButton-Outlined':{
            color:'#fff',
            borderColor:'#fff',
            '&:hover':{
                backgroundColor:'transparent',
            },
        }
    }

    return (
        <GridWrapper>
            我拥有的通证积分：
            <Grid
                item
                xs={8}
            >

                <CommonButton
                    size="large"
                    variant="contained"
                    sx={buttonStyles}
                >
                    button1
                </CommonButton>

                <CommonButton
                    size="large"
                    variant="outlined"
                    sx={buttonStyles}
                >
                    button2
                </CommonButton>


            </Grid>
        </GridWrapper>

    )
}

export default Point
