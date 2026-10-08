import React from 'react';
import './404Page.css';
import Layout from '../../components/Navbar/Layout';
import { Button } from '@mui/material';
import Meta from '../../components/Meta';
import { useI18n } from '../../i18n/I18nContext';

const ErrorPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <Meta title="404" />
      <div className="homeBackground" id="error">
        <Layout>
          <div className="homeOutline">
            <div className="homeTitle">404</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4>{t.notFound.message}</h4>
            <Button href="./" style={{ backgroundColor: '#3d7844', color: '#FFFFFF' }}>
              {t.notFound.home}
            </Button>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default ErrorPage;
