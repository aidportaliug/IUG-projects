import "../../styles/user.css";
import UserProfileComponent from "../../components/UserProfile";
import React from "react";
import Layout from "../../components/Navbar/Layout";

export default function UserView() {
  return (
    <>
      <Layout>
        <UserProfileComponent />
      </Layout>
    </>
  );
}
