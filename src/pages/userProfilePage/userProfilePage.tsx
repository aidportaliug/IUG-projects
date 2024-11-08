import "./userProfilePage.css";
import UserProfileComponent from "../../components/UserProfile";
import React from "react";
import Layout from "../../components/Navbar/Layout";
import Meta from "../../components/Meta";

export default function UserView() {
  return (
    <>
      <Meta title={"Your profile"}></Meta>
      <Layout>
        <UserProfileComponent />
      </Layout>
    </>
  );
}
