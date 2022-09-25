import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore'
import { db } from "../../services/firebaseConfig";
import { FormLabel, RadioGroup, FormControl, Radio } from '@mui/material';
import './signup.css'
import signUp from "../../services/signup";
export default function SignUp() {


  const theme = createTheme();
  

  const imageLogo = require('./../../images/logo.png');
  const imageIcon = require('./../../images/loginBilde.png');


  




  return (
    <div className='wholeLogin'>

      <div className='imagesignup'>
        <img className='imgHands' src={imageIcon} alt="" />
        <div className='signupText'>
          <p>Share your projects.</p>
          <p>connect with students.</p>
          <p>Make a difference.</p>
          <p>together.</p>
          <img className='imgLogo' src={imageLogo} alt="" />

        </div>
      </div>

      <div className='signupPart'>
        <ThemeProvider theme={theme}>
          
        </ThemeProvider>
      </div>
      </div>

      );
}