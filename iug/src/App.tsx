
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import UserView from "./pages/userprofile";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UploadProject from "./pages/UploadProject";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  //set default colors for all mui components
  const theme = createTheme({
    palette: {
      primary: {
        main: '#3D7844', // green color
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/User" element={<UserView />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/project" element={<ProjectDetailsPage/>}/>
          <Route path="/uploadProject" element={<UploadProject/>}/>
        </Routes>
      </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
