import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../services/auth';
import { useAuth } from '../../services/AuthContext';
import { useI18n } from '../../i18n/I18nContext';

// Menu entries are stable keys; the shown text comes from the active language.
export type NavMenuKey = 'plasticProjects' | 'profile' | 'logout' | 'login' | 'signUp' | 'approveSignups';

const routes: Partial<Record<NavMenuKey, string>> = {
  plasticProjects: '/plasticProjects',
  profile: '/user',
  login: '/login',
  signUp: '/signup',
  approveSignups: '/admin/signups',
};

interface MenuProps {
  setting: NavMenuKey;
}

const MenuItemIUG: React.FC<MenuProps> = ({ setting }) => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { t } = useI18n();

  const logout = async () => {
    await logOut();
    await refreshUser();
    console.log('User signed out');
    navigate('/');
  };

  const handleClick = () => {
    if (setting === 'logout') {
      logout();
    } else {
      navigate(routes[setting] ?? '/');
    }
  };

  return (
    <MenuItem onClick={handleClick}>
      <Typography textAlign="center">{t.nav[setting]}</Typography>
    </MenuItem>
  );
};

export default MenuItemIUG;
