import React from 'react';
import './userProfilePage.css';
import UserProfileComponent from '../../components/UserProfile/UserProfile';
import Layout from '../../components/Navbar/Layout';
import Meta from '../../components/Meta';
import Footer from '../../components/Footer/Footer';
import { useI18n } from '../../i18n/I18nContext';

const UserView: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <Meta title={t.profile.pageTitle} />
      <Layout>
        <UserProfileComponent />
      </Layout>
      <Footer />
    </>
  );
};

export default UserView;
