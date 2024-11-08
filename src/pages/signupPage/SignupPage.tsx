import { createTheme, ThemeProvider } from '@mui/material/styles';
import './signupPage.css';
import SignUpComponent from '../../components/Signup/Signup';
import Logo from './../../images/logo.png';
import ImageIcon from './../../images/loginBilde.png';
import React from 'react';
import Meta from '../../components/Meta';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const theme = createTheme();

  const imageLogo = Logo;
  const imageIcon = ImageIcon;

  return (
    <>
      <Meta title={'SignUp'}></Meta>
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
            Already have an account?&nbsp;
            <Link to="/login" className="signupLink">
              Log in.
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
