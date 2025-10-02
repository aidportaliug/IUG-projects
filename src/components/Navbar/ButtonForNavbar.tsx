import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  location: string;
  page: string;
}

const ButtonForNavbar: React.FC<ButtonProps> = ({ page, location }) => {
  const navigate = useNavigate();

  //const [, setAnchorElNav] = useState<null | HTMLElement>(null);

  /*const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  */

  //const path = '/' + page.toLowerCase().replace(/\s+g,'-');

  const handleClick = () => {
  if (page === 'Masterprojects') {
    navigate('/masterprojects');
  } else if (page === 'Experience Reports') {
    navigate('/experience-reports');
  }
};





  /*
   const handleClick = () = > {
    navigate(path);

  };
  */

  //const checkPage = () => location === '/' && page === 'Masterprojects';

  //const checkPage = () => location === path;

  const checkPage = () => {
    if (page === 'Masterprojects') {
      return location === '/masterprojects' || location === '/';
    } else if (page === 'Experience Reports') {
      return location === '/experience-reports';
    }
    return false;
  };



  return (
    <Button onClick = {handleClick}sx={{ my: 2, color: '#3D7844', display: 'block' }}>
      {checkPage() ? (
        <Typography className="bold">{page}</Typography>
      ) : (
        <Typography className="notBold">{page}</Typography>
      )}

    </Button>
  )


/*
  return (
    <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: '#3D7844', display: 'block' }}>
      {checkPage() ? (
        <Typography className="bold">{page}</Typography>
      ) : (
        <Typography className="notBold">{page}</Typography>
      )}
    </Button>
  );
  */

};

export default ButtonForNavbar;
