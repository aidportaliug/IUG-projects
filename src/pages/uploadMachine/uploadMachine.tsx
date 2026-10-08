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

const UploadMachine: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [userUpdatet, setUserUpdatet] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const navigate = useNavigate();

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
      <Meta title={'Upload a machine'}></Meta>
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
            Back
          </Button>
          <div className="title"> Upload Machine </div>
          <Button
            size="large"
            variant="outlined"
            style={{ color: 'black', textTransform: 'none', border: '1px solid grey', marginBottom: 20 }}
          >
            Save draft
          </Button>
        </Box>

        <div style={{ padding: '20px', fontFamily: 'var(--mainFontFamily), serif' }}>
          <p>This is the upload machine page. Add your machine upload form here...................................</p>
        </div>
        <UploadMachineForm />
      </div>
      <Footer />
    </>
  );
};

export default UploadMachine;
