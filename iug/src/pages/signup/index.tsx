import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/login.css";
import SignUpComponent from "../../components/Signup";
import Logo from "./../../images/logo.png";
import ImageIcon from "./../../images/loginBilde.png";
import React from "react";

export default function SignUp() {
  const theme = createTheme();

  const imageLogo = Logo;
  const imageIcon = ImageIcon;

  return (
    <div className="wholeLogin">
      <div className="imagesignup">
        <img className="imgHands" src={imageIcon} alt="" />
        <div className="signupText">
          <p>Share your projects.</p>
          <p>connect with students.</p>
          <p>Make a difference.</p>
          <p>together.</p>
          <img className="imgLogo" src={imageLogo} alt="" />
        </div>
      </div>

      <div className="signupPart">
        <ThemeProvider theme={theme}>
          <SignUpComponent />
        </ThemeProvider>
      </div>
    </div>
  );
}
