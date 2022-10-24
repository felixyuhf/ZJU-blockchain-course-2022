//icons
import PaidIcon from '@mui/icons-material/Paid';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TokenIcon from '@mui/icons-material/Token';


export const mainNavbarItems = [
    {
        id:0,
        icon: <PaidIcon />,
        label:'我的通证积分',
        route:'point',
    },
    {
        id:1,
        icon: <HowToVoteIcon />,
        label:'提案广场',
        route:'vote',
    },
    {
        id:2,
        icon:<TokenIcon />,
        label: '我的NFT',
        route:'nft',
    }
]