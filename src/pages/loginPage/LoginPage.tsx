import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './loginPage.css';
import LoginComponent from '../../components/Login/Login';
import { useFirebaseAuth } from '../../services/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import imageLogo from './../../images/logo.png';
import imageIcon from './../../images/loginBilde.png';
import Meta from '../../components/Meta';
import { useI18n } from '../../i18n/I18nContext';

const Login: React.FC = () => {
  const theme = createTheme();
  const { t } = useI18n();
  const { user } = useFirebaseAuth();

  if (user === null) {
    return (
      <>
        <Meta title={t.auth.loginPageTitle} />
        <div className="wholeLogin">
          <div className="loginBanner">
            <img className="loginBannerImage" src={imageIcon} alt="" />
            <div className="loginText">
              {t.auth.tagline.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <img className="imgLogo" src={imageLogo} alt="" />
          </div>

          <div className="loginPart">
            <p className="signupRedirect">
              {t.auth.notRegistered}&nbsp;
              <Link to="/signup" className="signupLink">
                {t.auth.signUpLink}
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
