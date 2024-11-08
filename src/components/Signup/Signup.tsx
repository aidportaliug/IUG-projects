import React, { useEffect } from 'react';
import { Container, Box, Typography, Grid, TextField, FormControl, Button } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import signUp from '../../services/signup';

const SignUpComponent: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('success!!!');
        navigate('/User');
      } else {
        console.log('not current user');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const firstName = data.get('firstName') as string;
      const lastName = data.get('lastName') as string;
      const email = data.get('email') as string;
      const phoneNumber = data.get('phoneNumber') as string;
      const institute = data.get('institute') as string;
      const university = data.get('university') as string;
      const password = data.get('password') as string;

      if (firstName && lastName && email && password) {
        await signUp(firstName, lastName, email, Number(phoneNumber), institute, university, password);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography className="loginHeader" component="h1" variant="h5">
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
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    label="Phone number"
                    name="phoneNumber"
                    autoComplete="Phone number"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth name="institute" label="Institute" id="institute" autoComplete="Institute" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="university"
                  label="University"
                  id="university"
                  autoComplete="University"
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
              style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUpComponent;
