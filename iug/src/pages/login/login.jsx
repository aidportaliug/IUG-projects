import * as React from 'react';
import { useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from "../../firebase-config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';
import './login.css'
const theme = createTheme();

export default function Login() {


  const imageLogo = require('./../../images/logo.png');
  const imageIcon = require('./../../images/loginBilde.png');

  const nav = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      await signInWithEmailAndPassword(
        auth, data.get("email"), data.get("password")
      );

    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(auth.currentUser);
        nav("/user");
      }
    });
  }, []);


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
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >

              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{backgroundColor: '#3D7844', color: '#FFFFFF'}}


                >
                  Sign In

                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <NavLink to="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </NavLink>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>

    </div>
  );
}