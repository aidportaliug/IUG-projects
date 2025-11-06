import React, { useState } from 'react';
import { Avatar, Button, TextField, Grid, Box } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { logOut } from '../../services/auth';
import { useAuth } from '../../services/AuthContext';
import { apiClient } from '../../services/apiClient';

const UserProfileComponent: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
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
    try {
      await apiClient.put('/me', formData);
      await refreshUser();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Update error:', error);
      alert(error.message || 'Failed to update profile');
    }
  };

  if (user) {
    return (
      <div className="user">
        <div className="top-part">
          <h1 className="username">{user.username}</h1>
        </div>
        <div className="profileIcon">
          <Avatar sx={{ width: 150, height: 150 }}>{user.username.charAt(0).toUpperCase()}</Avatar>
        </div>

        {!editing ? (
          <>
            <div className="interests">
              <h3>My information:</h3>
              <div className="myInterests">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                {user.firstName && (
                  <p>
                    <strong>First Name:</strong> {user.firstName}
                  </p>
                )}
                {user.lastName && (
                  <p>
                    <strong>Last Name:</strong> {user.lastName}
                  </p>
                )}
                {user.phoneNumber && (
                  <p>
                    <strong>Phone:</strong> {user.phoneNumber}
                  </p>
                )}
                {user.institute && (
                  <p>
                    <strong>Institute:</strong> {user.institute}
                  </p>
                )}
                {user.university && (
                  <p>
                    <strong>University:</strong> {user.university}
                  </p>
                )}
                <p>
                  <strong>User Type:</strong> {user.isProfessor ? 'Professor' : 'Student'}
                </p>
              </div>
            </div>
            <Button variant="contained" onClick={() => setEditing(true)} sx={{ mr: 2 }}>
              Edit Profile
            </Button>
            <Button variant="contained" id="btnLogOut" onClick={logout}>
              Log out
            </Button>
          </>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 600, mt: 3, p: 3 }}>
            <h3>Edit Profile</h3>
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Institute"
                  value={formData.institute}
                  onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="University"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleUpdate} sx={{ mr: 2 }}>
                Save Changes
              </Button>
              <Button variant="outlined" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default UserProfileComponent;
