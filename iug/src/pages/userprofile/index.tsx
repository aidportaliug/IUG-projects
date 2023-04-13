import "../../styles/user.css";
import UserProfileComponent from "../../components/UserProfile";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";

export default function UserView() {
  return (
    <>
      <Navbar />
      <UserProfileComponent />
    </>
  );
}
