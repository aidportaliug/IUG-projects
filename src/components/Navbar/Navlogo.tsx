import React from 'react';
import { useNavigate } from 'react-router-dom';
import IUGlogo from '../../images/logo.png';

const NavLogo: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <button
      onClick={handleLogoClick}
      style={{
        border: 'none',
        outline: 'none',
        padding: 0,
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
    >
      <img src={IUGlogo} alt="IUGLogo" style={{ width: '12em' }} />
    </button>
  );
};

export default NavLogo;
