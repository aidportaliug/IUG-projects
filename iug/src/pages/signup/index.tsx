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

  const [date, setDate] = useState();

  const theme = createTheme();
  const nav = useNavigate();

  const imageLogo = require('./../../images/logo.png');
  const imageIcon = require('./../../images/loginBilde.png');


  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(auth.currentUser);
        console.log("success!!!");
        nav("/User");
      }
      console.log("not current user");
    });
  }, []);

  const handleSignUp = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const firstName = data.get("firstName") as string;
      const lastName = data.get("lastName") as string;
      const gender = data.get("gender") as string;
      const age = data.get("age") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      
      if(firstName && lastName && gender && age && email && password) signUp(firstName, lastName, email, password, gender, age, )
      
    } catch (error) {
      console.log(error as string);
    }
  };





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
                Sign up
              </Typography>
              <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl >
                      <FormLabel >Gender</FormLabel>
                      <RadioGroup name="gender" row>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="age"
                      label="Age"
                      id="age"
                      autoComplete='age'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{backgroundColor: '#3D7844', color: '#FFFFFF'}}
                  
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <NavLink to="/">
                      Already have an account? Sign in
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