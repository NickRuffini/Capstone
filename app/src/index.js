import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GDP from "./Routes/gdp";
import Home from "./Routes/home";

ReactDOM.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="GDP" element={<GDP />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);
