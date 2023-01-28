
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import UserView from "./pages/userprofile";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UploadProject from "./pages/UploadProject";
// date-fns
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or for Day.js
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// or for Luxon
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
// or for Moment.js
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";

function App() {
  return (
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
  );
}

export default App;
