import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';

// Header pages: the route and the paths where the button is shown as active.
export const navPages = {
  plasticProjects: { route: '/plasticProjects', activeOn: ['/', '/plasticProjects'] },
};

export type NavPageKey = keyof typeof navPages;

interface ButtonProps {
  location: string;
  page: NavPageKey;
}

const ButtonForNavbar: React.FC<ButtonProps> = ({ page, location }) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { route, activeOn } = navPages[page];

  return (
    <Button onClick={() => navigate(route)} sx={{ my: 2, color: '#3D7844', display: 'block' }}>
      <Typography className={activeOn.includes(location) ? 'bold' : 'notBold'}>{t.nav[page]}</Typography>
    </Button>
  );
};

export default ButtonForNavbar;
