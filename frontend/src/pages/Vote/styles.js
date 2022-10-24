export const cardHeaderStyles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '20px',
        paddingRight: '20px',
        height: '65px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    newVoteButton: {
        fontSize: '1.05rem',
    },
    buttonStyles: {
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
}