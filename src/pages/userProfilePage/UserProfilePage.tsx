import React from 'react';
import './userProfilePage.css';
import UserProfileComponent from '../../components/UserProfile/UserProfile';
import Layout from '../../components/Navbar/Layout';
import Meta from '../../components/Meta';
import Footer from '../../components/Footer/Footer';

const UserView: React.FC = () => {
  return (
    <>
      <Meta title="Your profile" />
      <Layout>
        <UserProfileComponent />
      </Layout>
      <Footer />
    </>
  );
};

export default UserView;
