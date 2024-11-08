import React from 'react';
import './userProfilePage.css';
import UserProfileComponent from '../../components/UserProfile';
import Layout from '../../components/Navbar/Layout';
import Meta from '../../components/Meta';

const UserView: React.FC = () => {
  return (
    <>
      <Meta title="Your profile" />
      <Layout>
        <UserProfileComponent />
      </Layout>
    </>
  );
};

export default UserView;
