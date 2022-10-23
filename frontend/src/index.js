import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import {ThemeProvider} from '@mui/material/styles';
import {MyTheme} from "./MyTheme";

//pages
import Point from './pages/Point/point';
import Vote from './pages/Vote/vote';
import Nft from './pages/Nft/nft';


ReactDOM.render(
    <ThemeProvider theme={MyTheme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route path="point" element={<Point/>}/>
                    <Route path="vote" element={<Vote/>}/>
                    <Route path="nft" element={<Nft/>}/>


                </Route>
            </Routes>
        </BrowserRouter>

    </ThemeProvider>,

document.getElementById('root')
)
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
