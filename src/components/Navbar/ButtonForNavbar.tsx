import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';

interface ButtonProps {
  location: string;
  page: string;
}

const ButtonForNavbar = ({ page, location }: ButtonProps) => {
  const [, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const checkPage = () => {
    if (location === '/' && page === 'Masterprojects') {
      return true;
    } else {
      return false;
    }
  };
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
