import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/login.css";
import LoginComponent from "../../components/Login";
import { useFirebaseAuth } from "../../services/AuthContext";
import { Navigate } from "react-router-dom";
const theme = createTheme();

export default function Login() {
  const imageLogo = require("./../../images/logo.png");
  const imageIcon = require("./../../images/loginBilde.png");
  const {user} = useFirebaseAuth();
 if(user === null){
    return (
      <div className="wholeLogin">
        <div className="imageLogin">
          <img className="imgHands" src={imageIcon} alt="" />
          <div className="loginText">
            <p>Share your projects.</p>
            <p>connect with students.</p>
            <p>Make a difference.</p>
            <p>together.</p>
            <img className="imgLogo" src={imageLogo} alt="" />
          </div>
        </div>

        <div className="loginPart">
          <ThemeProvider theme={theme}>
            <LoginComponent />
          </ThemeProvider>
        </div>
      </div>
  );
  }
  else{
    return <Navigate to="/user" />
    
  }
}
