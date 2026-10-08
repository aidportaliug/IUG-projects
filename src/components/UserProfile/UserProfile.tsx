import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { canUploadProjects, logOut, userTypeLabel } from '../../services/auth';
import { useAuth } from '../../services/AuthContext';
import { apiClient } from '../../services/apiClient';
import MyUploads from './MyUploads';

const UserProfileComponent: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    institute: user?.institute || '',
    university: user?.university || '',
  });

  const logout = async () => {
    await logOut();
    await refreshUser();
    console.log('User signed out');
    navigate('/');
  };

  const handleUpdate = async () => {
    setFormError('');
    try {
      await apiClient.put('/me', formData);
      await refreshUser();
      setEditing(false);
    } catch (error: any) {
      console.error('Update error:', error);
      setFormError(error.message || 'Failed to update profile');
    }
  };

  if (user) {
    // Each inner list is one row; empty fields and rows are hidden.
    type Field = [string, string | null | undefined];
    const allRows: Field[][] = [
      [['User type', userTypeLabel(user)]],
      [
        ['Email', user.email],
        ['Username', user.username],
      ],
      [
        ['First name', user.firstName],
        ['Last name', user.lastName],
      ],
      [['Phone', user.phoneNumber]],
      [
        ['Institute', user.institute],
        ['University', user.university],
      ],
    ];
    const detailRows = allRows.map((row) => row.filter(([, value]) => !!value)).filter((row) => row.length > 0);
    const memberSince = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
      : null;

    return (
      <div className="profilePage">
        <section className="profileBanner">
          <div>
            <h1>{user.username}</h1>
            <div className="profileBannerMeta">
              <span className="profileBadge">{userTypeLabel(user)}</span>
              <span>{user.email}</span>
              {memberSince && <span>Member since {memberSince}</span>}
            </div>
          </div>
          <div className="profileBannerActions">
            <Button
              variant="outlined"
              onClick={logout}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
            >
              Log out
            </Button>
          </div>
        </section>

        <section className="profileCard">
          <div className="profileCardHeader">
            <h2>{editing ? 'Edit profile' : 'Account details'}</h2>
            {!editing && (
              <Button
                variant="outlined"
                onClick={() => setEditing(true)}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none' }}
              >
                Edit profile
              </Button>
            )}
          </div>

          {!editing ? (
            <dl className="profileDetails">
              {detailRows.map((row) => (
                <div key={row[0][0]} className="profileDetailsRow">
                  {row.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </div>
              ))}
            </dl>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Institute"
                    value={formData.institute}
                    onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="University"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  />
                </Grid>
              </Grid>
              {formError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {formError}
                </Typography>
              )}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ backgroundColor: '#3D7844', textTransform: 'none', '&:hover': { backgroundColor: '#2f5f35' } }}
                >
                  Save changes
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setEditing(false);
                    setFormError('');
                  }}
                  sx={{ color: '#3D7844', textTransform: 'none' }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </section>

        {canUploadProjects(user) && <MyUploads user={user} />}
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default UserProfileComponent;
