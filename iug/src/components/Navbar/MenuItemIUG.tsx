import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../services/auth";
import React from "react";

interface MenuProps {
  setting: string;
}

const MenuItemIUG = ({ setting }: MenuProps) => {
  const logout = async () => {
    logOut();
    console.log("User signed out");
    navigate("/");
  };

  const navigate = useNavigate();
  const handleOpenUserProfile = () => {
    if (setting === "Profile") {
      navigate("/user");
    }
    if (setting === "Logout") {
      logout();
    }
    if (setting === "Login") {
      navigate("/login");
    }
    if (setting === "Sign Up") {
      navigate("/signup");
    }
  };
  return (
    <MenuItem onClick={handleOpenUserProfile}>
      <Typography textAlign="center">{setting}</Typography>
    </MenuItem>
  );
};
export default MenuItemIUG;
