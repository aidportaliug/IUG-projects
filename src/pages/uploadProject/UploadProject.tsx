import React, { useEffect, useState } from 'react';
import './uploadProject.css';
import UploadProjectForm from '../../components/UploadProjectForm/UploadProjectForm';
import { useFirebaseAuth } from '../../services/AuthContext';
import { getCurrentUser } from '../../services/auth';
import { CustomUser } from '../../models/user';
import Meta from '../../components/Meta';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { Footer } from '../../components/Footer/Footer';

const UploadProject: React.FC = () => {
  //const [user, setUser] = useState<User | null>(null)
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
      <Meta title={'Upload your project'}></Meta>
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
          <div className="title"> Upload Your Project </div>
          <Button
            size="large"
            variant="outlined"
            style={{ color: 'black', textTransform: 'none', border: '1px solid grey', marginBottom: 20 }}
          >
            Save draft
          </Button>
        </Box>

        <UploadProjectForm />
      </div>
      <Footer
        nameLink1="Demo_1"
        nameLink1URL="demo.com"
        nameLink2="Demo_1"
        nameLink2URL="demo.com"
        nameLink3="Demo_1"
        nameLink3URL="demo.com"
        nameLink4="Demo_1"
        nameLink4URL="demo.com"
        category1="category1"
        category2="category2"
      />
    </>
  );
};

export default UploadProject;
