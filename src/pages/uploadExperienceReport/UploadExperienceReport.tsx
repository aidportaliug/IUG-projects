import React, { useEffect, useState } from 'react';
import './uploadExperienceReport.css';
import UploadExperienceReportForm from '../../components/UploadExperienceReportForm';
import { useFirebaseAuth } from '../../services/AuthContext';
import { CustomUser } from '../../models/user';
import { useGetUser } from '../../services/useGetUser';
import Meta from '../../components/Meta';
const UploadExperienceReport = () => {
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

  if (customUser !== null && customUser?.professor === false) {
    return (
      <>
        <Meta title={'Upload your Report'}></Meta>
        <div className="outline">
          <div className="title"> Upload Experience Report </div>
          <UploadExperienceReportForm />
        </div>
      </>
    );
  }
  return <div>You must be logged in and be a student</div>;
};

export default UploadExperienceReport;
