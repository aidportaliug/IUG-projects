import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { canUploadProjects, logOut, userTypeKey } from '../../services/auth';
import { useAuth } from '../../services/AuthContext';
import { apiClient } from '../../services/apiClient';
import MyUploads from './MyUploads';
import { useI18n } from '../../i18n/I18nContext';

const UserProfileComponent: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const { t, formatDate } = useI18n();
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
      setFormError(error.message || t.profile.updateFailed);
    }
  };

  if (user) {
    // Each inner list is one row; empty fields and rows are hidden.
    type Field = [string, string | null | undefined];
    const allRows: Field[][] = [
      [[t.profile.userType, t.userType[userTypeKey(user)]]],
      [
        [t.profile.email, user.email],
        [t.profile.username, user.username],
      ],
      [
        [t.profile.firstName, user.firstName],
        [t.profile.lastName, user.lastName],
      ],
      [[t.profile.phone, user.phoneNumber]],
      [
        [t.profile.institute, user.institute],
        [t.profile.university, user.university],
      ],
    ];
    const detailRows = allRows.map((row) => row.filter(([, value]) => !!value)).filter((row) => row.length > 0);
    const memberSince = user.createdAt ? formatDate(user.createdAt, { year: 'numeric', month: 'long' }) : null;

    return (
      <div className="profilePage">
        <section className="profileBanner">
          <div>
            <h1>{user.username}</h1>
            <div className="profileBannerMeta">
              <span className="profileBadge">{t.userType[userTypeKey(user)]}</span>
              <span>{user.email}</span>
              {memberSince && <span>{t.profile.memberSince(memberSince)}</span>}
            </div>
          </div>
          <div className="profileBannerActions">
            <Button
              variant="outlined"
              onClick={logout}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
            >
              {t.profile.logout}
            </Button>
          </div>
        </section>

        <section className="profileCard">
          <div className="profileCardHeader">
            <h2>{editing ? t.profile.editProfile : t.profile.accountDetails}</h2>
            {!editing && (
              <Button
                variant="outlined"
                onClick={() => setEditing(true)}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none' }}
              >
                {t.profile.editProfile}
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
                    label={t.profile.username}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t.profile.firstName}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t.profile.lastName}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t.profile.phone}
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t.profile.institute}
                    value={formData.institute}
                    onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t.profile.university}
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
                  {t.profile.save}
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setEditing(false);
                    setFormError('');
                  }}
                  sx={{ color: '#3D7844', textTransform: 'none' }}
                >
                  {t.profile.cancel}
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
