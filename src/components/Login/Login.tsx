import React, { useState } from 'react';
import { Container, Box, Typography, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import logIn from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useI18n } from '../../i18n/I18nContext';

const LoginComponent: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');
  const { t } = useI18n();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const data = new FormData(event.currentTarget);
      const success = await logIn(data.get('email') as string, data.get('password') as string);

      if (success) {
        await refreshUser();
        navigate('/plasticProjects');
      }
    } catch (error: any) {
      setError(error.message || t.auth.loginFailed);
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
          {t.auth.loginTitle}
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
            label={t.auth.email}
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t.auth.password}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label={t.auth.rememberMe} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}
          >
            {t.auth.signIn}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginComponent;
