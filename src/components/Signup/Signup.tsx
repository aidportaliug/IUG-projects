import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/auth';
import { useI18n } from '../../i18n/I18nContext';

const SignUpComponent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

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
      const isStudent = data.get('isStudent') === 'on';
      const password = data.get('password') as string;

      if (username && email && password) {
        const result = await signUp(username, email, password, {
          firstName,
          lastName,
          phoneNumber,
          isStudent,
        });

        if (result) {
          // New accounts can log in only after the administrator approves them.
          setSuccess(true);
        }
      }
    } catch (error: any) {
      setError(error.message || t.auth.registrationFailed);
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
            {t.auth.signUpTitle}
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {success ? (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography sx={{ mb: 2 }}>{t.auth.awaitingApproval}</Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                style={{ backgroundColor: '#3D7844', color: '#FFFFFF' }}
              >
                {t.auth.backToProjects}
              </Button>
            </Box>
          ) : (
            <Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="username"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label={t.auth.username}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    label={t.auth.firstName}
                    name="firstName"
                    autoComplete="given-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    label={t.auth.lastName}
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField required fullWidth id="email" label={t.auth.email} name="email" autoComplete="email" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <TextField id="phoneNumber" label={t.auth.phone} name="phoneNumber" autoComplete="tel" />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label={t.auth.password}
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox name="isStudent" id="isStudent" sx={{ '&.Mui-checked': { color: '#3D7844' } }} />
                    }
                    label={t.auth.isStudent}
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
                {loading ? t.auth.signingUp : t.auth.signUpButton}
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default SignUpComponent;
