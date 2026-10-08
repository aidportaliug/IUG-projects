import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../services/auth';
import { useAuth } from '../../services/AuthContext';

interface MenuProps {
  setting: string;
}

const MenuItemIUG: React.FC<MenuProps> = ({ setting }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const logout = async () => {
    await logOut();
    await refreshUser();
    console.log('User signed out');
    navigate('/');
  };

  const handleOpenUserProfile = () => {
    if (setting === 'Profile') {
      navigate('/user');
    } else if (setting === 'Logout') {
      logout();
    } else if (setting === 'Login') {
      navigate('/login');
    } else if (setting === 'Sign Up') {
      navigate('/signup');
    } else if (setting === 'Plastic Project') {
      navigate('/plasticProjects');
    }
  };

  return (
    <MenuItem onClick={handleOpenUserProfile}>
      <Typography textAlign="center">{setting}</Typography>
    </MenuItem>
  );
};

export default MenuItemIUG;
