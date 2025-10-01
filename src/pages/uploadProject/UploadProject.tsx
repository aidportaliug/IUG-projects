import React, { useEffect, useState } from 'react';
import './uploadProject.css';
import UploadProjectForm from '../../components/UploadProjectForm/UploadProjectForm';
import { useFirebaseAuth } from '../../services/AuthContext';
import { useGetUser } from '../../services/useGetUser';
import { CustomUser } from '../../models/user';
import Meta from '../../components/Meta';
import { useNavigate } from 'react-router-dom';
import { Button, Box} from '@mui/material';

const UploadProject: React.FC = () => {
  //const [user, setUser] = useState<User | null>(null)
  const { user } = useFirebaseAuth();
  const [userUpdatet, setUserUpdatet] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const navigate = useNavigate();
  async function CallGetUser(userId: string) {
    return await useGetUser(userId);
  }
  useEffect(() => {
    if (user !== null && !userUpdatet) {
      CallGetUser(user.uid).then((response) => setCustomUser(response));
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
        <Box display="flex" justifyContent='space-evenly' alignItems='center' marginTop='30px'>
          <Button 
            size='large'
            onClick={() => navigate(-1)} 
            variant="outlined"
            style={{color: 'black', textTransform: "none", border: '1px solid grey',
              backgroundColor: '#e0e0e0', marginBottom: 20}}>
            Back
          </Button>
          <div className="title"> Upload Your Project </div>
          <Button  
            size='large'
            variant="outlined"
            style={{color: 'black', textTransform: "none", border: '1px solid grey',
              marginBottom: 20}}>
            Save draft
          </Button>
        </Box>
        
        <UploadProjectForm />
      </div>
    </>
  );
};

export default UploadProject;
