import React, { useEffect, useState } from 'react';
import './uploadMachine.css';
import UploadMachineForm from '../../components/UploadMachineForm/uploadMachineForm';
import { useFirebaseAuth } from '../../services/AuthContext';
import { getCurrentUser } from '../../services/auth';
import { CustomUser } from '../../models/user';
import Meta from '../../components/Meta';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { Footer } from '../../components/Footer/Footer';
import { useI18n } from '../../i18n/I18nContext';

const UploadMachine: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [userUpdatet, setUserUpdatet] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const navigate = useNavigate();
  const { t } = useI18n();

  async function CallGetUser() {
    return await getCurrentUser();
  }

  useEffect(() => {
    if (user !== null && !userUpdatet) {
      CallGetUser().then((response) => setCustomUser(null));
      setUserUpdatet(true);
    }
  }, [customUser, user, userUpdatet]);

  if (customUser !== null && customUser?.professor === true) {
    return <div>You must be logged in, and be a professor</div>;
  }

  return (
    <>
      <Meta title={t.machineForm.pageTitle}></Meta>
      <div className="outline">
        <Box display="flex" justifyContent="space-evenly" alignItems="center" marginTop="30px">
          <Button
            size="large"
            onClick={() => navigate(-1)}
            variant="outlined"
            style={{
              color: 'black',
              textTransform: 'none',
              border: '1px solid grey',
              backgroundColor: '#e0e0e0',
              marginBottom: 20,
            }}
          >
            {t.common.back}
          </Button>
          <div className="title">{t.machineForm.heading}</div>
          <span style={{ width: 90 }} />
        </Box>

        <UploadMachineForm />
      </div>
      <Footer />
    </>
  );
};

export default UploadMachine;
