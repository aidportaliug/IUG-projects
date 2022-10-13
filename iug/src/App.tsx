import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import UserView from "./pages/userprofile";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/User" element={<UserView />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/project" element={<ProjectDetailsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
