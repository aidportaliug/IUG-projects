import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './loginPage.css';
import LoginComponent from '../../components/Login/Login';
import { useFirebaseAuth } from '../../services/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import imageLogo from './../../images/logo.png';
import imageIcon from './../../images/loginBilde.png';
import Meta from '../../components/Meta';

const Login: React.FC = () => {
  const theme = createTheme();
  const { user } = useFirebaseAuth();

  if (user === null) {
    return (
      <>
        <Meta title="LogIn" />
        <div className="wholeLogin">
          <div className="loginBanner">
            <img className="loginBannerImage" src={imageIcon} alt="" />
            <div className="loginText">
              <p>Share your projects.</p>
              <p>Connect with students.</p>
              <p>Make a difference.</p>
              <p>Together.</p>
            </div>
            <img className="imgLogo" src={imageLogo} alt="" />
          </div>

          <div className="loginPart">
            <p className="signupRedirect">
              Not registered yet?&nbsp;
              <Link to="/signup" className="signupLink">
                Sign Up.
              </Link>
            </p>
            <ThemeProvider theme={theme}>
              <LoginComponent />
            </ThemeProvider>
          </div>
        </div>
      </>
    );
  } else {
    return <Navigate to="/user" />;
  }
};

export default Login;
