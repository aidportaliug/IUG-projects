import React, { useEffect, useState } from 'react';
import './uploadExperienceReport.css';
import UploadExperienceReportForm from '../../components/UploadExperienceReportForm/UploadExperienceReportForm';
import { useFirebaseAuth } from '../../services/AuthContext';
import { CustomUser } from '../../models/user';
import { getCurrentUser } from '../../services/auth';
import Meta from '../../components/Meta';
import { Footer } from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

const UploadExperienceReport: React.FC = () => {
  const { user } = useFirebaseAuth();
  const [userUpdated, setUserUpdated] = useState<boolean>(false);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);

  async function CallGetUser() {
    return await getCurrentUser();
  }

  useEffect(() => {
    if (user !== null && !userUpdated) {
      CallGetUser().then((response) => setCustomUser(null));
      setUserUpdated(true);
    }
  }, [customUser, user, userUpdated]);

  //if (customUser !== null && customUser?.professor === false) {
  if (true) {
    return (
      <>
        <Meta title="Upload your Report" />
        <Navbar />
        <div className="outline">
          <UploadExperienceReportForm />
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
  }

  return <div>You must be logged in and be a student</div>;
};

export default UploadExperienceReport;
