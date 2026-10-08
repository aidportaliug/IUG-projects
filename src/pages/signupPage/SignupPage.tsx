import { createTheme, ThemeProvider } from '@mui/material/styles';
import './signupPage.css';
import SignUpComponent from '../../components/Signup/Signup';
import Logo from './../../images/logo.png';
import ImageIcon from './../../images/loginBilde.png';
import React from 'react';
import Meta from '../../components/Meta';
import { useI18n } from '../../i18n/I18nContext';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const theme = createTheme();
  const { t } = useI18n();

  const imageLogo = Logo;
  const imageIcon = ImageIcon;

  return (
    <>
      <Meta title={t.auth.signUpTitle} />
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
            {t.auth.haveAccount}&nbsp;
            <Link to="/login" className="signupLink">
              {t.auth.loginLink}
            </Link>
          </p>
          <ThemeProvider theme={theme}>
            <SignUpComponent />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default SignUp;
