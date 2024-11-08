import React from 'react';
import { Container, Box, Typography, TextField, FormControlLabel, Checkbox, Button, Divider } from '@mui/material';
import logIn from '../../services/auth';

const LoginComponent: React.FC = () => {
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      await logIn(data.get('email') as string, data.get('password') as string);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography className="loginHeader" component="h1" variant="h5">
          Log in to Projects Without Borders
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}
        >
          Feide Login
        </Button>
        <Divider sx={{ width: 400 }}>or</Divider>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
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
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      <a className="signupLink" href="/signup">
        Forgot password?
      </a>
    </Container>
  );
};

export default LoginComponent;
