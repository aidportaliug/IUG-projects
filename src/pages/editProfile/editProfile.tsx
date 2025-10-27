import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, TextField, FormControl, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../services/AuthContext'; // or whatever hook you use
import { useGetUser } from '../../services/useGetUser'; // adjust import
import updateUser from '../../services/updateUser'; // implement this service to update user in DB
import Layout from '../../components/Navbar/Layout';
import { MarginTwoTone } from '@mui/icons-material';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    institute: '',
    university: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login'); // or handle anonymous case
      return;
    }
    (async () => {
      try {
        const u = await useGetUser(user.uid); // returns your custom user object
        if (u) {
          setValues({
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            phoneNumber: u.phoneNumber?.toString() || '',
            institute: u.institute || '',
            university: u.university || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      console.error('No authenticated user');
      return;
    }

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: Number(values.phoneNumber || 0),
      institute: values.institute,
      university: values.university
    };

    console.log('Submitting profile update', { uid: user.uid, payload });

    try {
      const updated = await updateUser(user.uid, payload);
      console.log('Update successful', updated);
      setValues(prev => ({ ...prev, ...(updated || {}) }));
      navigate('/User', { state: { refreshed: true } });
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('Failed to save changes. See console for details.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Layout>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', mb: 2, marginTop: '3%' }}>
        <Button
          size='large'
          onClick={() => navigate(-1)} 
          variant="outlined"
          style={{color: 'black', textTransform: "none", border: '1px solid grey',
            backgroundColor: '#e0e0e0', position: 'absolute', left: 0, marginLeft: '500px'}}>
          Back
        </Button>
        <Typography component="h1" variant="h5" align='center'>Edit profile</Typography>
      </Box>
      <Container component="main" maxWidth="xs">
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField name="firstName" required fullWidth label="First Name" value={values.firstName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField name="lastName" required fullWidth label="Last Name" value={values.lastName} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="email" fullWidth label="Email" value={values.email} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField name="phoneNumber" fullWidth label="Phone number" value={values.phoneNumber} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField name="institute" fullWidth label="Institute" value={values.institute} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="university" fullWidth label="University" value={values.university} onChange={handleChange} />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} style={{ backgroundColor: '#3D7844', color: '#fff' }}>
              Save changes
            </Button>
          </Box>
      </Container>
    </Layout>
  );
};

export default EditProfile;