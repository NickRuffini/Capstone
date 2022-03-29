import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Weka from "./Routes/weka";
import Home from "./Routes/home";

ReactDOM.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="weka" element={<Weka />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
