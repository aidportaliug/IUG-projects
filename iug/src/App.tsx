import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/homepage/home';
import Login from './pages/login';
import SignUp from './pages/signup';
import UserView from './pages/userprofile';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/User" element={<UserView />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
