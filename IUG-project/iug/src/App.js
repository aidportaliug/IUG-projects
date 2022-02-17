import React from 'react';
import { Routes ,Route,  BrowserRouter } from 'react-router-dom';

import Login from './pages/login/login';
import Profile from './pages/profile/profile';
import Home from './pages/homepage/home';

import './App.css';



function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
  );
}
  

export default App;