import React, { useState } from 'react';
import { Container, Box, Typography, TextField, FormControlLabel, Checkbox, Button, Divider } from '@mui/material';
import logIn from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';

const LoginComponent: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    
    try {
      const data = new FormData(event.currentTarget);
      const success = await logIn(
        data.get('email') as string,
        data.get('password') as string
      );
      
      if (success) {
        await refreshUser();
        navigate('/User');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
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
        
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

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
    </Container>
  );
};

export default LoginComponent;