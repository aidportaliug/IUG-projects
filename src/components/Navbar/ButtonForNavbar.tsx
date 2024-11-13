import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface ButtonProps {
  location: string;
  page: string;
}

const ButtonForNavbar: React.FC<ButtonProps> = ({ page, location }) => {
  const [, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const checkPage = () => location === '/' && page === 'Masterprojects';

  return (
    <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: '#3D7844', display: 'block' }}>
      {checkPage() ? (
        <Typography className="bold">{page}</Typography>
      ) : (
        <Typography className="notBold">{page}</Typography>
      )}
    </Button>
  );
};

export default ButtonForNavbar;
