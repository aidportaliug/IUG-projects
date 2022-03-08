import React from 'react';
import { Routes ,Route,  BrowserRouter } from 'react-router-dom';

import Login from './pages/login/login';
import User from './pages/user/User';
import Home from './pages/homepage/home';
import SignUp from './pages/signup/signup';





function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/User" element={<User />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
  );
}
  

export default App;
