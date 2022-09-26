import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./signup.css";
import SignUpComponent from "../../components/Signup";
export default function SignUp() {
  const theme = createTheme();

  const imageLogo = require("./../../images/logo.png");
  const imageIcon = require("./../../images/loginBilde.png");

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
