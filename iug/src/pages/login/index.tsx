import { useEffect } from "react";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from '../../services/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import './login.css'
import logIn from "../../services/auth";
import LoginComponent from "../../components/Login";
const theme = createTheme();

export default function Login() {


  const imageLogo = require('./../../images/logo.png');
  const imageIcon = require('./../../images/loginBilde.png');



 



  return (

    <div className='wholeLogin'>

      <div className='imageLogin'>
      <img className='imgHands' src={imageIcon} alt=""/>
      <div className='loginText'>
        <p>Share your projects.</p>
        <p>connect with students.</p>
        <p>Make a difference.</p>
        <p>together.</p>
        <img className='imgLogo' src={imageLogo} alt=""/>
  
      </div>
      </div>

      <div className='loginPart'>
        <ThemeProvider theme={theme}>
          <LoginComponent/>
                 </ThemeProvider>
      </div>

    </div>
  );
}