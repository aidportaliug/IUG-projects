import React, { useState } from 'react';
import { Container, Box, Typography, Grid, TextField, FormControl, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/auth';
import { useAuth } from '../../services/AuthContext';

const SignUpComponent: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData(event.currentTarget);
      const username = data.get('username') as string;
      const firstName = data.get('firstName') as string;
      const lastName = data.get('lastName') as string;
      const email = data.get('email') as string;
      const phoneNumber = data.get('phoneNumber') as string;
      const institute = data.get('institute') as string;
      const university = data.get('university') as string;
      const password = data.get('password') as string;

      if (username && email && password) {
        const result = await signUp(username, email, password, {
          firstName,
          lastName,
          phoneNumber,
          institute,
          university
        });

        if (result) {
          setError('Registration successful! Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      console.error(error);
    } finally {
      setLoading(false);
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

          {error && (
            <Typography 
              color={error.includes('successful') ? 'success' : 'error'} 
              sx={{ mt: 2 }}
            >
              {error}
            </Typography>
          )}

          <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  required 
                  fullWidth 
                  id="email" 
                  label="Email Address" 
                  name="email" 
                  autoComplete="email" 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    id="phoneNumber"
                    label="Phone number"
                    name="phoneNumber"
                    autoComplete="tel"
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  name="institute" 
                  label="Institute" 
                  id="institute" 
                  autoComplete="organization-title" 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="university"
                  label="University"
                  id="university"
                  autoComplete="organization"
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
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
              style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignUpComponent;