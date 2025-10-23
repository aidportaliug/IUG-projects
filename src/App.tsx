import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/homePage/homePage';
import Login from './pages/loginPage/LoginPage';
import SignUp from './pages/signupPage/SignupPage';
import UserView from './pages/userProfilePage/UserProfilePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import UploadProject from './pages/uploadProject/UploadProject';
import UploadExperienceReport from './pages/uploadExperienceReport/UploadExperienceReport';
import ExperienceReports from './pages/experienceReports/experienceReports';
import Error from './pages/404Page/404Page';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FirebaseAuthProvider } from './services/AuthContext';

const App: React.FC = () => {
  // Set default colors for all MUI components
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
        <FirebaseAuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/User" element={<UserView />} />
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/project/:id" element={<ProjectDetailsPage />} />
              <Route path="/uploadProject" element={<UploadProject />} />
              <Route path="/uploadexperienceReport" element={<UploadExperienceReport />} />
              <Route path='/experienceReports' element={<ExperienceReports/>} />
              <Route path="/404" element={<Error />} />
            </Routes>
          </BrowserRouter>
        </FirebaseAuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
