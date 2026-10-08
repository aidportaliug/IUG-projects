import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/loginPage/LoginPage';
import SignUp from './pages/signupPage/SignupPage';
import UserView from './pages/userProfilePage/UserProfilePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import ReportDetailsPage from './pages/ReportDetailsPage/reportDetailPage';
import PlasticProjectDetailsPage from './pages/PlasticProjectDetailPage/plasticProjectDetailPage';
import UploadProject from './pages/uploadProject/UploadProject';
import UploadExperienceReport from './pages/uploadExperienceReport/UploadExperienceReport';
import ExperienceReports from './pages/experienceReports/experienceReports';
import PlasticProject from './pages/plasticPage/plasticProjects';
import Error from './pages/404Page/404Page';
import UploadPlasticProject from './pages/uploadPlasticProject/uploadPlasticProject';
import UploadMachine from './pages/uploadMachine/uploadMachine';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './services/AuthContext';
import MachineDetailsPage from './pages/MachineDetailPage/machineDetailPage';
import AdminSignupsPage from './pages/adminPage/AdminSignupsPage';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import 'dayjs/locale/nb';
import 'dayjs/locale/en-gb';

// Date pickers follow the chosen language (dd.mm.yyyy in Norwegian).
const DatePickerLocale: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useI18n();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang === 'nb' ? 'nb' : 'en-gb'}>
      {children}
    </LocalizationProvider>
  );
};

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
      <I18nProvider>
        <DatePickerLocale>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<PlasticProject />} />
                <Route path="/login" element={<Login />} />
                <Route path="/User" element={<UserView />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/admin/signups" element={<AdminSignupsPage />} />
                <Route path="/project/:id" element={<ProjectDetailsPage />} />
                <Route path="/report/:id" element={<ReportDetailsPage />} />
                <Route path="/plastic-project/:id" element={<PlasticProjectDetailsPage />} />
                <Route path="/plastic-project/:id/edit" element={<UploadPlasticProject />} />
                <Route path="/machine/:id" element={<MachineDetailsPage />} />
                <Route path="/uploadProject" element={<UploadProject />} />
                <Route path="/uploadexperienceReport" element={<UploadExperienceReport />} />
                <Route path="/experienceReports" element={<ExperienceReports />} />
                <Route path="/plasticProjects" element={<PlasticProject />} />
                <Route path="/404" element={<Error />} />
                <Route path="/UploadPlasticProject" element={<UploadPlasticProject />} />
                <Route path="/uploadMachine" element={<UploadMachine />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </DatePickerLocale>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
