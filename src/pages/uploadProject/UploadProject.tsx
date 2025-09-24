import React, { useEffect, useState } from 'react';
import './uploadProject.css';
import UploadProjectForm from '../../components/UploadProjectForm/UploadProjectForm';
import { useFirebaseAuth } from '../../services/AuthContext';
import { useGetUser } from '../../services/useGetUser';
import { CustomUser } from '../../models/user';
import Meta from '../../components/Meta';

const UploadProject: React.FC = () => {
  //const [user, setUser] = useState<User | null>(null)
  const { user } = useFirebaseAuth();
  const [userUpdatet, setUserUpdatet] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
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
        <div className="title"> Upload Your Project </div>
        <UploadProjectForm />
      </div>
    </>
  );
};

export default UploadProject;
